# EveryDollarGrows Financial Tools

Seven free browser-based financial education calculators, plus short learning activities with worked answers. No account, payment, email signup, external JavaScript or build step is needed. Inputs stay on the page; these static files do not send calculator entries to a server or save them. The hosting provider receives ordinary page requests.

**[Open the live financial tools](https://everydollargrows.github.io/everydollargrows-financial-tools/)**

| Tool | What it helps learners test |
| --- | --- |
| [Savings goal](https://everydollargrows.github.io/everydollargrows-financial-tools/) | Time to a target with existing savings, monthly deposits and a nominal interest assumption |
| [Emergency fund](https://everydollargrows.github.io/everydollargrows-financial-tools/emergency-fund/) | Essential expenses multiplied by a user-chosen coverage period and the remaining savings gap |
| [Debt payoff](https://everydollargrows.github.io/everydollargrows-financial-tools/debt-payoff/) | Payment size, payoff months and interest under a constant monthly-interest model |
| [Compound interest](https://everydollargrows.github.io/everydollargrows-financial-tools/compound-interest/) | Contributions versus hypothetical growth with month-end deposits |
| [Christmas savings](https://everydollargrows.github.io/everydollargrows-financial-tools/christmas-savings/) | Weekly deposits needed for a user-defined holiday target and deadline |
| [Budget percentages](https://everydollargrows.github.io/everydollargrows-financial-tools/budget-percentages/) | How each allocation compares with take-home income, including an overspending warning |
| [Grocery budget per person](https://everydollargrows.github.io/everydollargrows-financial-tools/grocery-budget/) | Monthly-to-weekly conversion and even per-person comparisons, not a food-cost recommendation |

**[Money learning activities](https://everydollargrows.github.io/everydollargrows-financial-tools/learning-activities/)** provide three estimate–test–explain exercises for teens, adult learners and families, including worked answers. They use fictional amounts so learners need not disclose personal finances.

## Calculation assumptions

- Savings and compound growth: `balance_next = balance * (1 + annual_rate / 1200) + monthly_deposit`. Deposits occur at month-end. Rates are nominal, not APY. The savings tool stops at the first month reaching the goal or at 1,200 months. Compound-interest years are rounded to the nearest whole month, up to 100 years.
- Debt: apply monthly interest, then a constant payment; reduce the final payment to the amount owed. Payments no larger than monthly interest are flagged. No monthly cent rounding, new charges or fees are modeled. Maximum horizon: 1,200 months.
- Emergency fund: `monthly_essential_expenses * coverage_months`; remaining gap cannot be negative. Coverage is chosen by the user, up to 120 months.
- Christmas: `max(0, target - saved) / whole_weeks`. Weekly deposits are rounded **up** to cents, with 1–520 deposits allowed.
- Budget: each allocation divided by income; all allocations count toward the total. Other allocation may include savings, giving and debt payments. No universal allocation rule is imposed.
- Grocery: monthly amount times `12 / 52` for a weekly average. This uses a 52-week planning year, not four weeks per month. Per-person figures are an even division.
- Money values must be finite, nonnegative and at most 1 trillion. Rates are 0–100%. Other limits are shown in the tools. Dollar labels illustrate one currency; no exchange-rate conversion is performed.

These are educational illustrations, not personalized financial advice, lender quotes or promised returns. Interest assumptions are constant; fees, taxes, inflation and market losses are excluded.

## Accessibility and development

Plain HTML/CSS/JavaScript with no dependencies. Open `index.html` locally, or serve the directory with `python3 -m http.server 8000`. Inputs have labels, output is a polite atomic status, keyboard focus is visible, and grids shrink to the available width. Methods and examples remain readable without JavaScript. Automated/static checks do not establish full WCAG conformance; assistive-technology user testing is still valuable.

Run mathematical and document regression checks with `node tests/calculators.test.cjs`. See [CONTRIBUTING.md](CONTRIBUTING.md) for maintenance requirements. No paid CI is required.

## Search discovery

`sitemap.xml` lists the eight distinct public HTML resources. Each has one self-referencing canonical and a unique title and description. A project-level `robots.txt` is included for reference, but **robots.txt only controls crawlers when served at the origin root** (`https://everydollargrows.github.io/robots.txt`). This project cannot configure that root file. Do not assume the project-level file submits the sitemap. Google/Bing webmaster submission requires access to the relevant verified property; no submission or indexing is claimed here.

## Related EDG resources

[Budgeting guide](https://everydollargrows.com/budgeting-guide/) · [Free Savings Goal Planner](https://everydollargrows.com/free-savings-goal-planner/) · [Grocery budgeting](https://everydollargrows.com/grocery-budget-calculator/) · [Financial calculators and tools](https://everydollargrows.com/personal-finance-calculators-and-tools/)

## Rights

Copyright 2026 EveryDollarGrows. Source is publicly viewable; no reuse license has been granted. Public availability is not an open-source license. Do not submit the source as openly licensed educational material or change its reuse rights without owner approval.
