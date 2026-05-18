# Branch Strategy

WI-FBA uses a simple GitHub flow.

## Branches

- `main`: stable branch for reviewed work
- `feature/<short-name>`: feature implementation branches
- `fix/<short-name>`: bug fix branches
- `docs/<short-name>`: documentation branches

## Rules

1. Work in a branch instead of committing directly to `main` after the initial foundation is created.
2. Open a pull request for each feature or fix.
3. Require CI to pass before merging.
4. Use squash merge for feature branches when the branch has many small implementation commits.
5. Keep PRs focused on one feature or one fix.

## Commit Prefixes

- `feat:` user-facing feature
- `fix:` bug fix
- `chore:` tooling or repository maintenance
- `docs:` documentation
- `test:` test-only change
- `refactor:` behavior-preserving code change
