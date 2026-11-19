# Maintaining these educational tools

Keep each resource useful without visiting a sales page. Explain formulas, timing, rounding, limits and examples in visible HTML. Preserve all existing public calculator URLs.

Before a change is published:
1. Run `node tests/calculators.test.cjs`.
2. Test blank, negative, zero, boundary and very large inputs through the UI. Verify that a final debt payment cannot exceed the amount owed.
3. Inspect narrow layouts and keyboard operation. Keep labels, visible focus, readable contrast and status announcements.
4. Verify canonical URLs, unique metadata and every sitemap entry. Internal links must resolve inside the project path; contextual EDG links must resolve to the actual resource.
5. Avoid dependencies, tracking and external scripts unless their need and privacy effects have been reviewed.

Report a reproducible error with fictional inputs through repository issues. Never put actual private financial data in a public issue. Proposed contributions are reviewed; no new license or rights grant is implied.
