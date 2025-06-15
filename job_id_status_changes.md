# Changes for adding job_id and status fields to Employee Interview Screening

## 1. Changes to MongoDB query filter in getAllScreenings:

```javascript
// Add these lines after the existing userid filter
if (req.query.job_id) {
  query.job_id = parseInt(req.query.job_id);
}
if (req.query.status) {
  query.status = req.query.status;
}
```

## 2. Changes to SQL query filter in getAllScreenings:

```javascript
// Add these lines after the existing userid filter
if (req.query.job_id) {
  filters.job_id = parseInt(req.query.job_id);
}
if (req.query.status) {
  filters.status = req.query.status;
}
```

## 3. Changes to MongoDB search in getAllScreenings:

```javascript
// Modify the $or array to include job_id and status
if (req.query.search) {
  query.$or = [
    { callid: new RegExp(req.query.search, 'i') },
    { userid: new RegExp(req.query.search, 'i') },
    { status: new RegExp(req.query.search, 'i') }
    // Note: job_id is a number so we don't include it in text search
  ];
}
```

## 4. Changes to SQL search in getAllScreenings:

```javascript
// Modify the [Op.or] array to include status
if (req.query.search) {
  const Op = Sequelize.Op;
  queryOptions.where = {
    ...queryOptions.where,
    [Op.or]: [
      { callid: { [Op.like]: `%${req.query.search}%` } },
      { userid: { [Op.like]: `%${req.query.search}%` } },
      { status: { [Op.like]: `%${req.query.search}%` } }
      // Note: job_id is a number so we don't include it in text search
    ]
  };
}
```

## 5. Changes to createScreening in MongoDB for new record creation:

```javascript
// Change each instance of new record creation to include job_id and status
screening = new EmployeeInterviewScreening({
  callid,
  userid,
  joinurl,
  job_id: job_id || null,
  status: status || 'pending',
  created: new Date(),
  updated: new Date()
});
```

## 6. Changes to createScreening in SQL for new record creation:

```javascript
// Change the create call to include job_id and status
screening = await EmployeeInterviewScreening.create({
  callid,
  userid,
  joinurl,
  job_id: job_id || null,
  status: status || 'pending'
});
```

## 7. Changes to updateScreening function:

```javascript
// Add these lines to the updateData object in both MongoDB and SQL sections
if (job_id !== undefined) updateData.job_id = job_id;
if (status !== undefined) updateData.status = status;
```

## 8. Changes to API documentation (employee-interview-screenings-api.md):

Update the Data Model section:

```markdown
### Employee Interview Screening Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer/String | Auto-generated | Unique identifier for the screening record |
| `callid` | String (100) | Optional | Unique call identifier for the screening session |
| `userid` | String (100) | Optional | User identifier for the screening participant |
| `joinurl` | Text | Optional | URL for joining the screening session |
| `job_id` | Integer | Optional | Reference to the job this screening is associated with |
| `status` | Enum | Default: 'pending' | Status of the interview (pending, in_progress, completed, cancelled, no_show) |
| `created` | DateTime | Auto-generated | Timestamp when the record was created |
| `updated` | DateTime | Auto-generated | Timestamp when the record was last updated |
```

Update the Query Parameters in the GET All Screenings section:

```markdown
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | Integer | 1 | Page number for pagination |
| `limit` | Integer | 10 | Number of records per page (max: 100) |
| `callid` | String | - | Filter by specific call ID |
| `userid` | String | - | Filter by specific user ID |
| `job_id` | Integer | - | Filter by specific job ID |
| `status` | String | - | Filter by screening status |
| `search` | String | - | Search across callid, userid, and status fields |
```

Update example request bodies for createScreening and updateScreening:

```json
{
  "callid": "call_125_alex_johnson",
  "userid": "user_890",
  "joinurl": "https://meet.talentspark.com/screening/call_125_alex_johnson",
  "job_id": 42,
  "status": "pending"
}
```
