# Data Model: Local Setup & Polish

## Entities

### User
- `id`: integer (auto-generated primary key)
- `name`: string (required, user display name)
- `email`: string (optional, university email)
- `role`: enum `student | teacher | admin` (required)
- `passwordHash`: string (required, for server-side auth)
- `college`: string (optional, student's college)
- `year`: string (optional, academic year)
- `createdAt`: datetime (auto-generated)
- **Relationships**: has many CourseEnrollments, has many ChatMessages

### NewsItem
- `id`: integer (auto-generated primary key)
- `title`: string (required)
- `body`: string (required)
- `category`: string (required — values: `أخبار`, `فعاليات`, `دورات`, `عاجل`, `أنشطة منجزة`)
- `date`: string (required, formatted `ar-EG`)
- `viewCount`: integer (default 0)
- `createdAt`: datetime (auto-generated)
- **State transitions**: viewCount increments on read

### Course
- `id`: integer (auto-generated primary key)
- `title`: string (required)
- `description`: string (required)
- `instructor`: string (required)
- `duration`: string (required, e.g. "4 أسابيع")
- `level`: string (required, e.g. `مبتدئ`, `متوسط`, `متقدم`)
- `category`: string (required, values: `تقنية وبرمجة`, `لغات`, `مهارات شخصية`, `إدارة وأعمال`)
- `totalSeats`: integer (required, > 0)
- `enrolledCount`: integer (default 0, <= totalSeats)
- `colorScheme`: integer (required, visual theme indicator)
- **Validation**: enrolledCount MUST NOT exceed totalSeats
- **State transitions**: enroll → enrolledCount++ (if enrolledCount < totalSeats); unenroll → enrolledCount--

### CourseEnrollment
- `id`: integer (auto-generated primary key)
- `courseId`: integer (required, FK → Course.id)
- `userId`: string (required, "guest" or user identifier)
- `createdAt`: datetime (auto-generated)
- **Relationships**: belongs to Course, belongs to User
- **Validation**: unique per (courseId, userId) pair

### ChatRoom
- `id`: integer (auto-generated primary key)
- `name`: string (required, room display name)
- `description`: string (required)
- `icon`: string (required, icon identifier)
- `onlineCount`: integer (default 0)

### ChatMessage
- `id`: integer (auto-generated primary key)
- `roomId`: integer (required, FK → ChatRoom.id)
- `sender`: string (required, display name)
- `message`: string (required)
- `isMe`: boolean (required, client-side attribution flag)
- `createdAt`: datetime (auto-generated)
- **Relationships**: belongs to ChatRoom

### Suggestion
- `id`: integer (auto-generated primary key)
- `name`: string (nullable, submitter name)
- `college`: string (nullable)
- `type`: string (required, values: `اقتراح`, `شكوى`, `فكرة نشاط`, `أخرى`)
- `message`: string (required)
- `createdAt`: datetime (auto-generated)

### VolunteerRegistration
- `id`: integer (auto-generated primary key)
- `name`: string (required)
- `college`: string (required)
- `phone`: string (required)
- `area`: string (required, volunteer category)
- `createdAt`: datetime (auto-generated)

### LibraryResource
- `id`: integer (auto-generated primary key)
- `title`: string (required)
- `subtitle`: string (required)
- `type`: string (required, values: `ملخصات`, `بحوث`, `كتب PDF`, `تسجيلات`)
- `rating`: number (default 0, 0-5 scale)
- `downloadCount`: integer (default 0)
- `college`: string (required, associated faculty)
- **State transitions**: downloadCount increments on download action

### ActivityEvent
- `id`: integer (auto-generated primary key)
- `title`: string (required)
- `description`: string (required)
- `date`: string (required, date string)
- `month`: string (required, Arabic month name)
- `icon`: string (required, icon identifier)

### Member
- `id`: integer (auto-generated primary key)
- `name`: string (required)
- `role`: string (required, union role title)
- `department`: string (required, college/department)
- `year`: string (required, academic year)
- `category`: string (required, values: `القيادة التنفيذية`, `رؤساء اللجان`, `ممثلو الكليات`)
- `initials`: string (required, Arabic initials for avatar)

### College
- `id`: integer (auto-generated primary key)
- `name`: string (required)
- `studentCount`: integer (required)
- `hasNews`: boolean (default false)
- `hasSchedules`: boolean (default false)
- `hasFiles`: boolean (default false)
- `hasActivities`: boolean (default false)
- `icon`: string (required, icon identifier)

### FaqItem
- `id`: integer (auto-generated primary key)
- `question`: string (required)
- `answer`: string (required)
- `category`: string (required, categorization tag)

## Relationships Summary

```
Course 1───* CourseEnrollment *───1 User
ChatRoom 1───* ChatMessage *───1 User (optional)
```

All other entities are standalone content collections managed via CRUD.
