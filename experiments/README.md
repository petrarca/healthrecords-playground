# HealthRecords Playground Experiments

This directory contains experimental features and standalone applications that are part of the HealthRecords Playground project.

## Available Experiments

### Thea - HealthRecords Assistant Intent Recognition

A prototype for intent recognition in the HealthRecords Assistant using TensorFlow.js and the Universal Sentence Encoder.

**To run this experiment:**

```bash
cd thea
npm run dev
```

Or use the provided script:

```bash
./thea/run.sh
```

The application will start on port 5174 and can be accessed at http://localhost:5174

## Adding New Experiments

Each experiment should be a self-contained application with its own:

1. `package.json` file
2. `vite.config.js` configuration
3. Dependencies

This ensures that experiments don't interfere with the main application and can be developed and tested independently.
