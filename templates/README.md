# Templates

One JSON file per game. They are bundled at build time, so adding or editing a
file and pushing to `main` publishes it — no app code to touch.

```json
{
  "id": "catan",
  "name": "Catan",
  "note": "optional line under the name in the picker",
  "order": 0,
  "categories": [
    "Settlements & cities",
    "Longest road",
    "Largest army",
    "Victory point cards"
  ]
}
```

| Field | Required | Notes |
|---|---|---|
| `id` | no | Unique, kebab-case. Defaults to the filename. Changing it detaches games already using the template. |
| `name` | yes | Shown in the picker. |
| `note` | no | Small text under the name; defaults to the category count. |
| `order` | no | Lower sorts first, default `100`; ties sort by name. |
| `categories` | yes | In scoring order. Blank entries are dropped; a file with none is ignored. |

Categories become the rows people score against, so keep them short enough to
read on a phone. To add a game, copy any file, rename it, edit it, and push.
