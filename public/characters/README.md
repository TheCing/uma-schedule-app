# Character Thumbnails

Place character thumbnail images in this directory.

Currently includes **90 characters** from the Global server.

## Image Requirements

- **Format**: JPG, PNG, or WebP
- **Dimensions**: Recommended 300x400px (3:4 aspect ratio)
- **Size**: Keep under 200KB per image for optimal loading

## Naming Convention

Images should match the filenames specified in `src/data/characters.json`.

Example filenames:

```
special-week.jpg
silence-suzuka.jpg
tokai-teio.jpg
vodka.jpg
daiwa-scarlet.jpg
gold-ship.jpg
mejiro-mcqueen.jpg
tm-opera-o.jpg
kitasan-black.jpg
satono-diamond.jpg
... (90 total characters)
```

See `src/data/characters.json` for the complete list of all character IDs and filenames.

## Adding More Characters

1. Add the image file to this directory
2. Add the character data to `src/data/characters.json`:

```json
{
  "id": "character-id",
  "name": "Character Name",
  "preferredDistance": "Medium",
  "thumbnail": "/characters/character-id.jpg"
}
```

The app will show placeholder initials for any missing images.
