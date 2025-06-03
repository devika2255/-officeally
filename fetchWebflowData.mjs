import express from "express";
import fetch from "node-fetch";
import { WebflowClient } from "webflow-api";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

// Webflow credentials
const webflowApiKey = "e955e9bc52388f9653ebdc2026c192fd7f2028c0e0100ba1437808d3cb2fb3ca";
const collectionId = "6717fea435e253ccdf9a12b8";

// Webflow client
const client = new WebflowClient({ accessToken: webflowApiKey });

// CORS config
const corsOptions = {
  origin: "https://list.officeally.com",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Delay helper to prevent rate-limiting
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fetch all items with pagination
async function fetchWebflowCollectionItems() {
  console.log("Fetching all Webflow collection items...");
  const allItems = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    try {
      const response = await client.collections.items.listItems(collectionId, {
        limit,
        offset,
      });

      allItems.push(...response.items);

      if (response.items.length < limit) {
        break;
      }

      offset += limit;
    } catch (error) {
      console.error("Error fetching items:", error.message || error);
      break;
    }
  }

  console.log(`Fetched ${allItems.length} items total`);
  return allItems;
}

// Update items with new sort-field in uppercase
async function updateWebflowCollectionItems(itemsToUpdate) {
  const results = [];

  for (const { itemId, fields } of itemsToUpdate) {
    if (!itemId || !fields?.name || !fields?.slug) {
      results.push({ itemId, success: false, error: "Missing required fields" });
      continue;
    }

    const fieldData = {
      ...fields,
      "sort-field": fields.name.toUpperCase(),  // force uppercase here as well for safety
      _archived: false,
      _draft: false,
    };

    const url = `https://api.webflow.com/v2/collections/${collectionId}/items/${itemId}/live`;

    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${webflowApiKey}`,
          "Content-Type": "application/json",
          "Accept-Version": "1.0.0",
        },
        body: JSON.stringify({ fieldData }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error(`Update failed for ${itemId}:`, error);
        results.push({ itemId, success: false, error });
        continue;
      }

      const updated = await res.json();
      console.log(`Updated item: ${itemId}`);
      results.push({ itemId, success: true, item: updated });

      await delay(1000);
    } catch (err) {
      console.error(`Network error on ${itemId}:`, err.message);
      results.push({ itemId, success: false, error: err.message });
    }
  }

  return results;
}

// Webhook handler
app.post("/webflow-webhook", async (req, res) => {
  try {
    const payload = req.body.payload;
    if (!payload || !payload.id) {
      return res.status(400).send("Missing payload or item ID");
    }

    if (payload.isDraft || payload.isArchived) {
      return res.status(200).send("Ignoring draft/archived item");
    }

    const itemId = payload.id;

    const fields = {
      name: payload.fieldData.name,
      slug: payload.fieldData.slug,
      "sort-field": payload.fieldData.name.toUpperCase(),
    };

    console.log("Name:", payload.fieldData.name, "sort-field:", fields["sort-field"]);

    const updates = [{ itemId, fields }];
    const updateResults = await updateWebflowCollectionItems(updates);

    return res.status(200).json({ message: "Update triggered", updateResults });
  } catch (err) {
    console.error("Error handling webhook:", err);
    res.status(500).json({ error: err.message });
  }
});

// On server start, sync all items
async function syncAllItemsOnStart() {
  const items = await fetchWebflowCollectionItems();

  const updates = items.map((item) => ({
    itemId: item.id,
    fields: {
      name: item.fieldData.name,
      slug: item.fieldData.slug,
      "sort-field": item.fieldData.name.toUpperCase(),
    },
  }));

  console.log(`Processing ${updates.length} items to update sort-field...`);
  await updateWebflowCollectionItems(updates);
}

// Start server
app.listen(port, "0.0.0.0", async () => {
  console.log(`Server is running on port ${port}`);
  await syncAllItemsOnStart();
});
