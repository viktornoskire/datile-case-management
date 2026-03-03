# Project Conventions

This document defines the structural, naming, Git, configuration, review, and quality standards for the project.  
All contributors are expected to follow these rules.

---

# 1. Repository Structure

## 1.1 Backend (Spring Boot)

```
backend/
 └─ src/main/java/com/datile/casemanagement/
     ├─ controller/
     ├─ service/
     ├─ repository/
     ├─ domain/
     ├─ dto/
     ├─ config/
     └─ exception/
```

### Responsibilities

- **controller/** – Handles HTTP requests and responses. No business logic.
- **service/** – Contains business logic.
- **repository/** – JPA repositories and data access.
- **domain/** – Entities and core domain models.
- **dto/** – Request and response objects.
- **config/** – Application configuration (security, CORS, etc.).
- **exception/** – Custom exceptions and global handlers.

---

## 1.2 Frontend (React + TypeScript)

```
frontend/
 └─ src/
     ├─ pages/
     ├─ components/
     ├─ services/
     ├─ hooks/
     ├─ types/
     └─ utils/
```

### Responsibilities

- **pages/** – Route-level components.
- **components/** – Reusable UI components.
- **services/** – API communication logic.
- **hooks/** – Custom React hooks.
- **types/** – Shared TypeScript types and interfaces.
- **utils/** – Pure helper functions only.

---

# 2. Naming Conventions

## 2.1 Backend

### Endpoints

- Use plural nouns.
- Use kebab-case in URLs.
- Do not include verbs in the path.

Examples:

```
GET    /api/errands
GET    /api/errands/{id}
POST   /api/errands
PATCH  /api/errands/{id}
DELETE /api/errands/{id}
```

### DTO Naming

Use descriptive suffixes:

- `CreateErrandRequest`
- `UpdateErrandRequest`
- `ErrandResponse`
- `PurchaseResponse`

### Class & Variable Naming

- Classes: PascalCase
- Methods and fields: camelCase
- Avoid unnecessary abbreviations

---

## 2.2 Frontend

- Components: `PascalCase.tsx`
- Hooks: `useSomething.ts`
- Services: `somethingService.ts`
- Types: `Something.ts`
- Variables and functions: camelCase

---

# 3. Configuration & Secrets

## 3.1 General Rules

- No secrets may be committed to the repository.
- `.env` files must be gitignored.
- Secrets must never be hardcoded.

Never commit:

- Database credentials
- JWT secrets
- API keys
- Third-party tokens

---

## 3.2 Backend Configuration

Use Spring profiles:

```
application.yml
application-dev.yml
application-test.yml
```

Default profile:

```
profiles:
  default: dev
```

Use environment variables inside configuration files:

```
spring:
  datasource:
    password: ${DB_PASSWORD}
```

---

## 3.3 Frontend Configuration

Use environment files:

```
.env.local
.env.production
```

All exposed frontend variables must be prefixed with:

```
VITE_
```

---

# 4. Git Workflow

## 4.1 Branching Strategy

- `main` must always be deployable.
- Direct commits to `main` are not allowed.
- All changes must go through Pull Requests.

Branch naming format:

```
issue.number-short-description
```

Examples:

```
1.1-add-errand-filtering
2.1-add-purchase-service
3.2.1-add-purchase-mapper
```

---

## 4.2 Pull Requests

Each Pull Request must include:

- Title (Conventional Commit format)
- Clear description of the change
- Reason for the change
- Test steps
- Screenshots (if UI changes)
- Related issue reference (if applicable)

### Example Pull Request

```
### feat: add API wrapper and environment configuration

### Description
Introduces a centralized API wrapper for frontend requests and adds environment-based configuration using `VITE_API_URL`.

### Reason for the Change
Removes hardcoded URLs, reduces duplication, and centralizes HTTP logic to improve maintainability.

### Test Steps
1. Add `VITE_API_URL=http://localhost:8080/api` to `.env.local`
2. Start backend and frontend
3. Verify errands load correctly
4. Confirm no hardcoded URLs remain
5. Run production build successfully

### Screenshots
N/A

### Related Issue
#44
```

### Pull Request Rules

- At least one review is required.
- CI must pass before merge.
- The branch must be deleted after merge.

---

# 5. Commit Message Convention

Use Conventional Commits format:

```
type: short description
```

Allowed types:

- feat
- fix
- refactor
- docs
- chore
- test

Examples:

```
feat: add errand filtering
fix: prevent null pointer in purchase service
refactor: extract purchase mapper
docs: add conventions documentation
chore: update dependencies
```

Optional extended format:

```
feat: add errand filtering

- added search query parameter
- added unit tests
- updated documentation
```

---

# 6. Code Reviews & Conventional Comments

All changes must go through code review before merging.

We use structured Conventional Comments to ensure clarity and consistency.

---

## 6.1 Comment Structure

Comments must follow this format:

```
**type**(optional-scope)[optional-decorator]: message
```

Where:

- type = praise | suggestion | issue | question | nitpick | chore
- decorator = blocking | non-blocking (optional)

---

## 6.2 Blocking Rules

Use `(blocking)` when the issue must be resolved before merging.

Example:

```
**issue**(blocking): This endpoint returns 500 when the list is empty. It should return 200 with an empty array.
```

Non-blocking example:

```
**suggestion**(non-blocking): Consider extracting this logic into a helper method.
```

Pull Requests must not be approved while blocking comments remain unresolved.

---

## 6.3 Review Guidelines

Reviewers must:

- Focus on correctness, clarity, and maintainability.
- Avoid subjective style debates (formatting is handled by tools).
- Provide actionable feedback.
- Keep discussions within the PR thread.

---

## 6.4 Comment Examples

```
**praise**: Nice separation between controller and service layer.
**issue**(blocking): Missing null check for purchaseId.
**suggestion**: This method could be simplified using Optional.map.
**question**: Should this endpoint be publicly accessible?
**nitpick**: Minor typo in the error message.
```

---

# 7. Code Style & Quality Gates

## 7.1 Backend

- Use Spotless for formatting.
- Formatting must run locally and in CI.
- Build must pass.
- All tests must pass.

PRs must fail if:

- Formatting fails
- Tests fail
- Build fails

---

## 7.2 Frontend

- Use ESLint.
- Use Prettier.
- TypeScript must compile without errors.

PRs must fail if:

- Lint fails
- Type errors exist
- Build fails

---

# 8. CI Requirements

The CI pipeline must enforce the following:

Backend:
- Build project
- Run tests
- Verify formatting

Frontend:
- Install dependencies
- Run lint
- Run type check
- Build project

Pull Requests cannot be merged unless all checks pass.