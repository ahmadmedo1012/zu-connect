# API Contracts: Local Setup & Polish

## Source of Truth

The canonical API contract is defined in `lib/api-spec/openapi.yaml` (OpenAPI 3.1).
All endpoints below are derived from that spec. After any spec change, run:

```sh
pnpm --filter @workspace/api-spec run codegen
```

This regenerates `lib/api-zod` (validation schemas) and `lib/api-client-react`
(React Query hooks) from the spec.

## Endpoints by Module

### Health
| Method | Path | Operation | Request | Response |
|--------|------|-----------|---------|----------|
| GET | `/api/healthz` | healthCheck | — | `HealthStatus` |

### Stats
| Method | Path | Operation | Request | Response |
|--------|------|-----------|---------|----------|
| GET | `/api/stats` | getStats | — | `PlatformStats` |

### News
| Method | Path | Operation | Request | Response |
|--------|------|-----------|---------|----------|
| GET | `/api/news` | listNews | `?category=` | `NewsItem[]` |
| POST | `/api/news` | createNews | `NewsInput` | `NewsItem` |
| GET | `/api/news/{id}` | getNews | `id: int` | `NewsItem` |

### Courses
| Method | Path | Operation | Request | Response |
|--------|------|-----------|---------|----------|
| GET | `/api/courses` | listCourses | `?category=` | `Course[]` |
| POST | `/api/courses` | createCourse | `CourseInput` | `Course` |
| POST | `/api/courses/{id}/enroll` | enrollCourse | `EnrollmentInput` | `Course` |
| POST | `/api/courses/{id}/unenroll` | unenrollCourse | `EnrollmentInput` | `Course` |

### Members
| Method | Path | Operation | Request | Response |
|--------|------|-----------|---------|----------|
| GET | `/api/members` | listMembers | `?category=` | `Member[]` |

### Colleges
| Method | Path | Operation | Request | Response |
|--------|------|-----------|---------|----------|
| GET | `/api/colleges` | listColleges | — | `College[]` |

### Library
| Method | Path | Operation | Request | Response |
|--------|------|-----------|---------|----------|
| GET | `/api/library` | listLibrary | `?type=` | `LibraryResource[]` |

### Planner
| Method | Path | Operation | Request | Response |
|--------|------|-----------|---------|----------|
| GET | `/api/planner` | listPlanner | `?month=` | `PlannerEvent[]` |

### Chat
| Method | Path | Operation | Request | Response |
|--------|------|-----------|---------|----------|
| GET | `/api/chat/rooms` | listChatRooms | — | `ChatRoom[]` |
| GET | `/api/chat/rooms/{roomId}/messages` | listChatMessages | `roomId: int` | `ChatMessage[]` |
| POST | `/api/chat/rooms/{roomId}/messages` | sendChatMessage | `ChatMessageInput` | `ChatMessage` |

### Suggestions
| Method | Path | Operation | Request | Response |
|--------|------|-----------|---------|----------|
| POST | `/api/suggestions` | createSuggestion | `SuggestionInput` | `Suggestion` |

### Volunteers
| Method | Path | Operation | Request | Response |
|--------|------|-----------|---------|----------|
| POST | `/api/volunteers` | createVolunteer | `VolunteerInput` | `Volunteer` |

### FAQ
| Method | Path | Operation | Request | Response |
|--------|------|-----------|---------|----------|
| GET | `/api/faq` | listFaq | — | `FaqItem[]` |

## Validation

All request bodies and query parameters are validated at runtime via Zod
schemas from `@workspace/api-zod`. Key schemas:

- `ListNewsQueryParams`, `CreateNewsBody`, `GetNewsParams`
- `ListCoursesQueryParams`, `CreateCourseBody`, `EnrollmentBody`
- `ListMembersQueryParams`
- `ListLibraryQueryParams`
- `ListPlannerQueryParams`
- `CreateChatMessageBody`
- `CreateSuggestionBody`
- `CreateVolunteerBody`

Zod parse failures return HTTP 400 with error details.

## Database Contract

All endpoints read/write through Drizzle ORM (`@workspace/db`).
Entity schemas in `lib/db/src/schema/` define the table structure.
Migrations managed via `drizzle-kit push` (dev) or `drizzle-kit generate` + apply.
