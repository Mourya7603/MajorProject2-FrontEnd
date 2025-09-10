# Anvaya CRM

A comprehensive Customer Relationship Management system designed to streamline lead management, sales tracking, and team collaboration. Built with a React frontend, Express/Node backend, MongoDB database.

---

## Demo Link
[Live Demo](https://major-project2-front-end.vercel.app/)

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Mourya7603/MajorProject2-FrontEnd.git
cd anvaya-crm

# Install dependencies
npm install

# Start development server
npm run dev

# Or for production
npm start
```
---

## Technologies
- Frontend: React JS, React Router, Context API
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose ODM
- Styling: CSS3 with Dark/Light theme support
- Charts: Chart.js for data visualization

---

## Demo Video
Watch a walkthrough (5-7 minutes) of all major features of this app: [Video Link](https://drive.google.com/file/d/1OcSaqRCZm5n1zAkDxasHFKjdiiKwivbA/view?usp=sharing)

---

## Features
**Dashboard**
- Overview of key performance metrics
- Visual charts showing lead status distribution
- Quick access to recent activities

**Lead Management**
- Comprehensive lead listing with filtering and sorting
- Add new leads with detailed information
- View and edit lead details
- Track lead status and priority levels
- Assign leads to sales agents

**Sales Agent Management**
- Manage sales team members
- Track agent performance metrics
- Assign leads to appropriate agents

**Reporting & Analytics**
- Visual charts for lead status distribution
- Agent performance reports
- Conversion rate tracking
- Pipeline value calculations

**User Experience**
- Responsive design for desktop and mobile
- Dark/Light theme toggle
- Intuitive navigation and user interface
- Real-time data updates

---

## API Reference
**Leads**
### **GET	/api/leads**<br>	 
List all leads with filtering options<br>	 
Sample Response:<br>
```[{ _id, name, company, status, priority, ... }, …]```

### **GET	/api/leads/:id**<br>	 	
Get details for one lead<br>		
Sample Response:<br>
```{ _id, name, company, status, priority, source, salesAgent, ... }```

### **POST	/api/leads**<br> 	
Create a new lead (protected)<br>	
Sample Response:<br>
```{ _id, name, company, status, ... }```

### **GET	/api/agents**<br>	 
List all sales agents<br>	 
Sample Response:<br>
```[{ _id, name, email, ... }, …]```

### **GET	/api/leads/:id/comments**<br>	 
Get all comments for a lead<br>	 
Sample Response:<br>
```[{ _id, text, author, createdAt, ... }, …]```

### **POST	/api/leads/:id/comments**<br>	 
Add a comment to a lead (protected)<br>	 
Sample Response:<br>
```{ _id, text, author, createdAt, ... }```

### **GET	/api/report/pipeline**<br>	 
Get pipeline analytics report<br>	 
Sample Response:<br>
```{ totalLeads, pipelineValue, statusDistribution: {...} }```

### **GET	/api/report/performance**<br>	 
Get agent performance report<br>	 
Sample Response:<br>
```[{ agentName, totalLeads, closedLeads, conversionRate, ... }, …]```

---

## Contact
For bugs or feature requests, please reach out to magalapallimourya@gmail.com
