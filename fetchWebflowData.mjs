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

// Update single item with new sort-field in uppercase
async function updateWebflowCollectionItems(itemsToUpdate) {
  const results = [];

  for (const { itemId, fields } of itemsToUpdate) {
    if (!itemId || !fields?.name || !fields?.slug) {
      results.push({ itemId, success: false, error: "Missing required fields" });
      continue;
    }

    const fieldData = {
      ...fields,
      "sort-field": fields.name.toUpperCase(),
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

      await delay(1000); // optional: prevent Webflow rate limit
    } catch (err) {
      console.error(`Network error on ${itemId}:`, err.message);
      results.push({ itemId, success: false, error: err.message });
    }
  }

  return results;
}

// Webhook handler for newly created items
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

    console.log("New item received:", {
      name: fields.name,
      "sort-field": fields["sort-field"],
    });

    const updates = [{ itemId, fields }];
    const updateResults = await updateWebflowCollectionItems(updates);

    return res.status(200).json({ message: "Update triggered", updateResults });
  } catch (err) {
    console.error("Error handling webhook:", err);
    res.status(500).json({ error: err.message });
  }
});

// Start server without syncing all items
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
