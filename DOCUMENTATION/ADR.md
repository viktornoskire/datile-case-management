# ARCHITECTURAL DECISION RECORDS
### _Documentation of the most important technical and architectural choises_ 
###
--- ---

## ADR-0001: Target platform is Linux with Docker containers
_Status: Accepted_

## Decision
We target Linux as the primary runtime platform and deploy the application as Docker containers 
(local and future environments).

## Purpose
Ensure a consistent runtime environment, predictable deployments
and easy portability between machines and environments.

## Consequences
Developers must use Docker for local setup. 
OS-specific behavior is minimized by running everything in containers.

## User impact: 
The system behaves the same across environments, which reduces downtime and “random” production issues for users.
--- ---

## ADR-0002: Backend framework is Java with Spring Boot
_Status: Accepted_

## Decision
We build the backend in Java using Spring Boot as the application framework.

## Purpose
Use a mature ecosystem with strong support for REST APIs, testing, validation, 
dependency injection and production readiness.

## Consequences
Team conventions should follow Spring patterns. 
Framework upgrades must be handled deliberately to avoid breaking changes.

## User impact: 
Users get a more stable and responsive system because the backend is built on a mature, production-ready framework.
--- ---

## ADR-0003: Local database strategy
_Status: Accepted_

## Decision
We use MySQL as the persistent database for the system.
We run locally via Docker Compose and pin image version (8.0.36).
Persistent storage and readiness checks are part of the Compose setup.

## Purpose
Provide reliable relational storage for core entities (customers, errands users etc.) 
with strong transactional guarantees.

## Consequences
Schema design and migrations become a first-class concern. 
We must manage environment parity (local/CI/prod) for MySQL.
Developers need Docker. Upgrading MySQL requires a PR and verification of migrations/tests.

## User impact: 
Users never touch the database directly, but it ensures their customers/errands are saved reliably and searches/updates work consistently without data loss.
--- ---

## ADR-0004: Frontend uses React with TypeScript (TSX)
_Status: Accepted_

## Decision
We build the frontend using React and TypeScript (TSX).

## Purpose
Enable a maintainable UI with strong typing, component reuse 
and a clear separation from backend concerns.

## Consequences
Frontend requires its own build/test pipeline. 
API contracts must be kept stable and documented.

## User impact: 
Users get a smoother UI with fewer frontend bugs and clearer feedback when something goes wrong.
--- ---

## ADR-0005: Architectural boundaries (Domain > Application > Adapters)
_Status: Accepted_

## Decision
We structure the backend with clear boundaries: Domain, Application (use cases) 
and Adapters/Infrastructure (web, persistence).
Domain logic stays framework-independent.

## Purpose
Keep business rules testable and stable while allowing infrastructure (Spring/JPA/DB) to change without rewriting the core.

## Consequences
More structure upfront. Code reviews must enforce boundaries to prevent “framework leakage” into domain logic.

## User impact: 
Features are easier to extend without breaking existing behavior, so users see fewer regressions when new functionality is added.
--- ---

## ADR-0006: Database schema is managed with Flyway migrations
_Status: Accepted_

## Decision
We manage database schema changes using Flyway with versioned migrations committed to the repository.

## Purpose
Make schema changes reproducible across local, CI and future deployments and avoid manual “someone changed the DB” drift.

## Consequences
All schema changes must go through migrations. 
A broken migration can block startup/CI and must be fixed via a new migration.

## User impact: 
Updates are safer because database changes are controlled and repeatable, reducing broken releases that would block users.
--- ---

## ADR-0007: CI quality gate on every Pull Request
_Status: Accepted_

## Decision
Each Pull Request must pass CI that runs build + automated tests for the backend (and frontend if included).
CI includes a real MySQL service/container so migrations and integration tests can run.

## Purpose
Prevent broken code from being merged and keep main stable and releasable.

## Consequences
PRs cannot merge if CI fails. Test stability and CI maintenance become non-negotiable work.

## User impact: 
Users get fewer “new release broke everything” moments because changes are automatically tested before merging into main.
--- ---

## ADR-0008: API standards for consistent REST behavior
_Status: Accepted_

## Decision
We apply consistent REST conventions for endpoints and list operations 
(search, pagination, sorting) and standardize error responses.

## Purpose
Make the API predictable for the frontend and reduce friction when adding new resources.

## Consequences
Endpoints must follow the agreed contract. 
Changes to contracts are breaking and require coordination.

## User impact: 
The UI stays consistent and predictable (search/sort/pagination behave the same everywhere), making the system easier to use.
--- ---

## ADR-0009: Authentication and roles strategy 
_Status: Proposed_

## Decision
We will implement authentication and role-based access control.
but the exact method is not finalized yet.

## Purpose
Protect customer/errand data and ensure users only see and do what their role allows.

## Consequences
Until finalized, endpoints and UI permissions may be implemented in a minimal/temporary way. 
This ADR must be updated once the auth approach is chosen.

## User impact: 
Users only see what they’re allowed to see, protecting sensitive data and preventing accidental or unauthorized changes.
--- ---
