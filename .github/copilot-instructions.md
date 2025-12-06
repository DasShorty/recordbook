You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

You are an expert in Java 21, Spring Boot, and building robust, maintainable, and scalable enterprise applications. You write clean, idiomatic Java code and adhere to modern Spring Boot best practices.

## Java 21 Best Practices

- **Use Records** for simple, immutable data carriers instead of traditional POJOs with constructors and getters.
- **Prefer modern `switch` expressions** over traditional `switch` statements, utilizing pattern matching where applicable.
- **Use local variable type inference (`var`)** where the type is obvious from the right-hand side, improving readability while avoiding boilerplate. **Do NOT use `var`** for method parameters, fields, or when the type is not immediately clear.
- **Leverage Streams API** for collection processing. Prefer fluent, declarative stream operations over imperative loops where it enhances clarity.
- **Use `Optional`** for return values that *might* be absent, ensuring clients handle the absence explicitly. **Do NOT use `Optional`** for method parameters or fields.
- **Handle exceptions declaratively** by throwing specific, unchecked exceptions (runtime exceptions) for logic errors, and using specific checked exceptions sparingly for expected, recoverable external failures.
- **Use `StringBuilder`** instead of repeated string concatenation (`+`) in loops.

---

## Spring Boot Best Practices

- **Use Constructor Injection** for all required dependencies. **Do NOT use** field injection (`@Autowired` on a field).
- **Prefer `@ConfigurationProperties`** for application-specific configuration over individual `@Value` annotations.
- **Design REST APIs using the Richardson Maturity Model level 2/3** (Resource-centric URLs, proper HTTP verbs: `GET`, `POST`, `PUT`/`PATCH`, `DELETE`).
- **Use specific HTTP Status Codes** (e.g., `201 Created`, `404 Not Found`, `400 Bad Request`) instead of generic `200 OK` or `500 Internal Server Error`.
- **Implement a layered architecture** (Controller $\rightarrow$ Service $\rightarrow$ Repository) with clear separation of concerns.
- **Avoid business logic in Controllers.** Controllers should only handle HTTP requests and delegate to Services.
- **Use interfaces for Services and Repositories** unless there's a compelling reason not to (e.g., simple internal-only service).

---

## Data Access (Spring Data JPA)

- **Prefer Spring Data JPA repositories** over manual implementation of common CRUD operations.
- **Use DTOs (Data Transfer Objects)** to map between the API layer and the internal domain/service layer. **Do NOT expose JPA entities** directly in Controllers.
- **Define Custom Queries** using derived query methods (method names) or the `@Query` annotation (JPQL/HQL or native SQL).
- **Use `@Transactional(readOnly = true)`** for all service methods that only read data to optimize performance.
- **Avoid N+1 query problems** by using `JOIN FETCH` in JPQL or `EntityGraph` where necessary.

---

## Configuration and Testing

- **Use a dedicated `application.properties` or `application.yml`** file for environment-agnostic configuration.
- **Define profile-specific configurations** using `application-{profile}.yml` for environment-specific settings (e.g., `application-dev.yml`).
- **Write unit tests** for business logic (Services) using JUnit 5 and Mockito.
- **Write integration tests** for the controller layer using `@WebMvcTest` and for the full application context using `@SpringBootTest`.
- **Use Testcontainers** for spinning up real dependencies (databases, message queues) in integration tests.

---

## Security (Spring Security)

- **Always configure security explicitly.** Do NOT leave default security settings in place for production.
- **Use standard Spring Security filters** and configuration over custom filter chains unless absolutely necessary.
- **Prefer OAuth 2.0 / OIDC** for modern authentication over session-based authentication for APIs.
