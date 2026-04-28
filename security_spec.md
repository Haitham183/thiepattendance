# Security Specification: AcademiaSync

## 1. Data Invariants
- Only Admins and Supervisors can create/update specializations and groups.
- Instructors can only view groups assigned to them.
- Instructors can only mark attendance and evaluations for trainees in their assigned groups.
- Trainees cannot modify any data.
- User roles are immutable once set except by an Admin.
- Attendance status must be one of [P, A, E, H, L].
- Evaluation scores must be 0-100.
- Timestamps must be server-generated.

## 2. The "Dirty Dozen" Payloads (Expect: PERMISSION_DENIED)

1. **Identity Spoofing**: An instructor attempts to update another instructor's assigned group.
2. **Privilege Escalation**: A supervisor tries to update their own role to 'admin'.
3. **Ghost Field Injection**: Adding an `isAdmin: true` field to a user profile during creation.
4. **Orphaned Record**: Creating a trainee with a non-existent `groupId`.
5. **Unauthorized Attendance**: Instructor A marking attendance for a group belonging to Instructor B.
6. **Past Attendance Manipulation**: Updating attendance for a date older than 30 days (business rule).
7. **Score Overflow**: Submitting an evaluation score of 101.
8. **Malicious ID**: Creating a group with a 2KB string as ID to cause resource exhaustion.
9. **Role Modification**: An instructor trying to delete a specialization.
10. **State Shortcutting**: Trainee trying to update their own evaluation average.
11. **Cross-Tenant Access**: User trying to read all user profiles (unless admin).
12. **PII Leakage**: Unauthenticated user trying to read trainee mobile numbers.

## 3. Test Runner Concept
The tests will live in `firestore.rules.test.ts` (simulated logic for the agent to follow).
