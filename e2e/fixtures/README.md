# E2E Test Fixtures

This directory contains test files used for end-to-end testing.

## Files

- **test-car.jpg**: Valid image file (< 5MB, JPEG format) for testing successful vehicle image uploads
- **invalid-file.txt**: Invalid file type for testing file upload validation and error handling

## Usage

These fixtures are used in `e2e/critical-flow.spec.ts` to test:
- Successful image uploads
- File type validation
- File size validation
- Error handling for invalid uploads

## Notes

- Keep file sizes reasonable (< 1MB for valid images)
- Do not commit large files to the repository
- Update this README when adding new fixtures
