export interface ComplianceData {
    Compliance_Instance_ID: number;
    Compliance_ID: number;
    IHRC_Company_Name: string;
    Location: string;
    Legislation: string;
    Compliance_Categorization: string;
    Compliance_Header: string;
    Compliance_Description: string;
    Penalty_Description: string;
    Compliance_Applicability: string;
    Bare_Act_Text: string;
    Compliance_Clause: string;
    Compliance_Type: string;
    Compliance_Frequency: string;
    Compliance_Statutory_Authority: string;
    Approval_Required: boolean;
    Criticality: string;
    Penalty_Type: string;
    Default_Due_Date: string;
    First_Due_Date: string;
    Due_Date: Date | string;
    Scheduled_Frequency: string;
    Proof_Of_Compliance_Mandatory: boolean;
    Owner_Name: string;
    Owner_User_Name: string;
    Approver_Name: string;
    Approver_User_Name: string;
    Reminder: string;
    Effective_Date_Of_Change: string;
    Reason_To_Edit: string;
    Edited_On: string;
    Edited_By: string;
    Compliance_Status: string;
    Status: string;
    Remark: string;
  }
  
  export const dummyData: ComplianceData[] = [
    {
        Compliance_Instance_ID: 1001,
        Compliance_ID: 3236,
        IHRC_Company_Name: "CEAT",
        Location: "HMVL - Office - Muzaffarpur - sadtpur - HR/ Muzaffarpur/ Bihar/ Office",
        Legislation: "Bihar Shops and Establishments Act 1953 and Bihar Shops Establishments Rules 1955/ Bihar/ IR",
        Compliance_Categorization: "Licensing",
        Compliance_Header: "Renewal of Registration",
        Compliance_Description: "Annual renewal of shop and establishment license",
        Penalty_Description: "Fines up to ₹5000 and potential closure",
        Compliance_Applicability: "All shops and commercial establishments",
        Bare_Act_Text: "Make an application when registration certificate is lost or destroyed to the Inspecting Officer within seven days of such loss or destruction for a duplicate copy along with a payment of a fee of two rupees either by crossed Indian Postal Order or by d",
        Compliance_Clause: "Section 15",
        Compliance_Type: "Renewal",
        Compliance_Frequency: "Annual",
        Compliance_Statutory_Authority: "Maharashtra Labor Department",
        Approval_Required: true,
        Criticality: "Low",
        Penalty_Type: "Monetary and Operational",
        Default_Due_Date: "December 31",
        First_Due_Date: "2023-12-31",
        Due_Date: new Date("2024-12-31"),
        Scheduled_Frequency: "Yearly",
        Proof_Of_Compliance_Mandatory: true,
        Owner_Name: "Rahul Sharma",
        Owner_User_Name: "rahul.sharma@ceat.com",
        Approver_Name: "Priya Patel",
        Approver_User_Name: "priya.patel@ceat.com",
        Reminder: "30 days before due date",
        Effective_Date_Of_Change: "2023-01-01",
        Reason_To_Edit: "Updated due to change in company policy",
        Edited_On: "2023-06-15",
        Edited_By: "Admin User",
        Compliance_Status: 'NA',
        Status: 'Pending',
        Remark: 'Missing Information in uploaded Document'
      },
      {
        Compliance_Instance_ID: 1002,
        Compliance_ID: 4501,
        IHRC_Company_Name: "TechInnovate",
        Location: "HMVL - Office - Arrah - Ramana Pakri Road - HR/ Arrah/ Bihar/ Office",
        Legislation: "Delhi Factories Act 1948 and Delhi Factories Rules 1950/ Delhi/ IR",
        Compliance_Categorization: "Labor Law",
        Compliance_Header: "Employee Work Hours Record",
        Compliance_Description: "Maintenance of employee work hours record",
        Penalty_Description: "Fines up to ₹10000 for non-compliance",
        Compliance_Applicability: "All IT companies with more than 10 employees",
        Bare_Act_Text: "Employer shall maintain a record of employee work hours",
        Compliance_Clause: "Section 28",
        Compliance_Type: "Record Keeping",
        Compliance_Frequency: "Daily",
        Compliance_Statutory_Authority: "Karnataka Labor Department",
        Approval_Required: false,
        Criticality: "Medium",
        Penalty_Type: "Monetary",
        Default_Due_Date: "Ongoing",
        First_Due_Date: "2023-01-01",
        Due_Date: "",
        Scheduled_Frequency: "Daily",
        Proof_Of_Compliance_Mandatory: true,
        Owner_Name: "Arun Kumar",
        Owner_User_Name: "arun.kumar@techinnovate.com",
        Approver_Name: "Sneha Reddy",
        Approver_User_Name: "sneha.reddy@techinnovate.com",
        Reminder: "Weekly",
        Effective_Date_Of_Change: "2023-03-15",
        Reason_To_Edit: "Updated due to amendment in labor laws",
        Edited_On: "2023-03-20",
        Edited_By: "HR Manager",
        Compliance_Status: 'NA',
        Status: 'Pending',
        Remark: 'Missing Information in uploaded Document'
      },
      {
        Compliance_Instance_ID: 1003,
        Compliance_ID: 5602,
        IHRC_Company_Name: "GreenEnergy",
        Location: "HMVL - Office - Aurangabad - Priyavrat Path - HR/ Aurangabad/ Bihar/ Office",
        Legislation: "Karnataka Shops and Commercial Establishments Act 1961 and Karnataka Shops Rules 1963/ Karnataka/ IR",
        Compliance_Categorization: "Environmental",
        Compliance_Header: "Emission Control Report",
        Compliance_Description: "Submission of monthly emission control report",
        Penalty_Description: "Fines up to ₹100000 and potential closure",
        Compliance_Applicability: "All manufacturing units",
        Bare_Act_Text: "Every industry shall submit monthly emission reports",
        Compliance_Clause: "Section 21",
        Compliance_Type: "Reporting",
        Compliance_Frequency: "Monthly",
        Compliance_Statutory_Authority: "Tamil Nadu Pollution Control Board",
        Approval_Required: true,
        Criticality: "High",
        Penalty_Type: "Monetary and Operational",
        Default_Due_Date: "5th of every month",
        First_Due_Date: "2023-02-05",
        Due_Date: new Date("2024-09-05"),
        Scheduled_Frequency: "Monthly",
        Proof_Of_Compliance_Mandatory: true,
        Owner_Name: "Karthik Subramanian",
        Owner_User_Name: "karthik.s@greenenergy.com",
        Approver_Name: "Lakshmi Narayan",
        Approver_User_Name: "lakshmi.n@greenenergy.com",
        Reminder: "5 days before due date",
        Effective_Date_Of_Change: "2023-01-01",
        Reason_To_Edit: "Updated due to new environmental regulations",
        Edited_On: "2023-01-10",
        Edited_By: "Environmental Officer",
        Compliance_Status: 'NA',
        Status: 'Pending',
        Remark: 'Missing Information in uploaded Document'
      },
      {
        Compliance_Instance_ID: 1004,
        Compliance_ID: 6789,
        IHRC_Company_Name: "MegaRetail",
        Location: "HMVL - Office - Begusarai - Kachhari Road - HR/ Begusarai/ Bihar/ Office",
        Legislation: "Maharashtra Shops and Establishments Act 1948 and Maharashtra Shops Rules 1954/ Maharashtra/ IR",
        Compliance_Categorization: "Labor Law",
        Compliance_Header: "Weekly Off Day",
        Compliance_Description: "Ensuring weekly off day for employees",
        Penalty_Description: "Fines up to ₹20000",
        Compliance_Applicability: "All retail establishments",
        Bare_Act_Text: "Every employee shall be given at least one day off in a week",
        Compliance_Clause: "Section 14",
        Compliance_Type: "Operational",
        Compliance_Frequency: "Weekly",
        Compliance_Statutory_Authority: "Delhi Labor Department",
        Approval_Required: false,
        Criticality: "Medium",
        Penalty_Type: "Monetary",
        Default_Due_Date: "Ongoing",
        First_Due_Date: "2023-01-01",
        Due_Date: "",
        Scheduled_Frequency: "Weekly",
        Proof_Of_Compliance_Mandatory: true,
        Owner_Name: "Amit Gupta",
        Owner_User_Name: "amit.gupta@megaretail.com",
        Approver_Name: "Neha Singh",
        Approver_User_Name: "neha.singh@megaretail.com",
        Reminder: "Start of each week",
        Effective_Date_Of_Change: "2023-04-01",
        Reason_To_Edit: "Updated due to change in store timings",
        Edited_On: "2023-04-05",
        Edited_By: "Store Manager",
        Compliance_Status: 'NA',
        Status: 'Pending',
        Remark: 'Missing Information in uploaded Document'
      },
      {
        Compliance_Instance_ID: 1005,
        Compliance_ID: 7890,
        IHRC_Company_Name: "PharmaHealth",
        Location: "HMVL - Office - Samastipur - ShivSagar Plazza -HR / Samastipur/ Bihar/ Office",
        Legislation: "Tamil Nadu Shops and Establishments Act 1947 and Tamil Nadu Shops Rules 1959/ Tamil Nadu/ IR",
        Compliance_Categorization: "Pharmaceutical",
        Compliance_Header: "Good Manufacturing Practices Audit",
        Compliance_Description: "Annual GMP audit for pharmaceutical manufacturing",
        Penalty_Description: "License cancellation and legal action",
        Compliance_Applicability: "All pharmaceutical manufacturers",
        Bare_Act_Text: "Manufacturers shall comply with Good Manufacturing Practices",
        Compliance_Clause: "Schedule M",
        Compliance_Type: "Audit",
        Compliance_Frequency: "Annual",
        Compliance_Statutory_Authority: "Central Drugs Standard Control Organization",
        Approval_Required: true,
        Criticality: "High",
        Penalty_Type: "Operational and Legal",
        Default_Due_Date: "March 31",
        First_Due_Date: "2024-03-31",
        Due_Date: new Date("2024-03-31"),
        Scheduled_Frequency: "Yearly",
        Proof_Of_Compliance_Mandatory: true,
        Owner_Name: "Dr. Rajesh Khanna",
        Owner_User_Name: "rajesh.khanna@pharmahealth.com",
        Approver_Name: "Dr. Sunita Reddy",
        Approver_User_Name: "sunita.reddy@pharmahealth.com",
        Reminder: "60 days before due date",
        Effective_Date_Of_Change: "2023-04-01",
        Reason_To_Edit: "Updated due to new FDA guidelines",
        Edited_On: "2023-04-10",
        Edited_By: "Quality Assurance Head",
        Compliance_Status: 'Complied',
        Status: 'Approved',
        Remark: 'Missing Information in uploaded Document'
      },
      {
        Compliance_Instance_ID: 1006,
        Compliance_ID: 8901,
        IHRC_Company_Name: "EcoConstruct",
        Location: "HMVL - Office - Bhagalpur - Tilkamanjhi Chowk - HR/ Bhagalpur/ Bihar/ Office",
        Legislation: "Maharashtra Building and Other Construction Workers Act, 1996",
        Compliance_Categorization: "Labor Safety",
        Compliance_Header: "Safety Equipment Provision",
        Compliance_Description: "Provision of safety equipment to construction workers",
        Penalty_Description: "Fines up to ₹50000 and imprisonment up to 3 months",
        Compliance_Applicability: "All construction companies",
        Bare_Act_Text: "Employer shall provide safety equipment to all workers",
        Compliance_Clause: "Section 40",
        Compliance_Type: "Operational",
        Compliance_Frequency: "Ongoing",
        Compliance_Statutory_Authority: "Maharashtra Labor Safety Department",
        Approval_Required: false,
        Criticality: "High",
        Penalty_Type: "Monetary and Legal",
        Default_Due_Date: "Ongoing",
        First_Due_Date: "2023-01-01",
        Due_Date: "",
        Scheduled_Frequency: "Daily",
        Proof_Of_Compliance_Mandatory: true,
        Owner_Name: "Suresh Patel",
        Owner_User_Name: "suresh.patel@ecoconstruct.com",
        Approver_Name: "Anita Desai",
        Approver_User_Name: "anita.desai@ecoconstruct.com",
        Reminder: "Daily",
        Effective_Date_Of_Change: "2023-06-01",
        Reason_To_Edit: "Updated due to new safety regulations",
        Edited_On: "2023-06-05",
        Edited_By: "Safety Officer",
        Compliance_Status: 'Complied',
        Status: 'Approved',
        Remark: 'Missing Information in uploaded Document'
      },
      {
        Compliance_Instance_ID: 1007,
        Compliance_ID: 9012,
        IHRC_Company_Name: "DataSecure",
        Location: "HMVL - Office - Darbhanga - Laheriyaserai Road - HR/ Darbhanga/ Bihar/ Office",
        Legislation: "Information Technology Act, 2000",
        Compliance_Categorization: "Data Protection",
        Compliance_Header: "Data Breach Notification",
        Compliance_Description: "Notification of data breaches to affected parties",
        Penalty_Description: "Fines up to ₹5 crores",
        Compliance_Applicability: "All IT companies handling personal data",
        Bare_Act_Text: "Data fiduciary shall notify the data breach to Data Protection Authority and data principal",
        Compliance_Clause: "Section 25",
        Compliance_Type: "Reporting",
        Compliance_Frequency: "As needed",
        Compliance_Statutory_Authority: "Data Protection Authority of India",
        Approval_Required: true,
        Criticality: "Low",
        Penalty_Type: "Monetary",
        Default_Due_Date: "Within 72 hours of breach discovery",
        First_Due_Date: "As needed",
        Due_Date: "",
        Scheduled_Frequency: "As needed",
        Proof_Of_Compliance_Mandatory: true,
        Owner_Name: "Vikram Malhotra",
        Owner_User_Name: "vikram.malhotra@datasecure.com",
        Approver_Name: "Shalini Kapoor",
        Approver_User_Name: "shalini.kapoor@datasecure.com",
        Reminder: "Immediate upon breach discovery",
        Effective_Date_Of_Change: "2023-08-01",
        Reason_To_Edit: "Updated due to new data protection laws",
        Edited_On: "2023-08-05",
        Edited_By: "Data Protection Officer",
        Compliance_Status: 'Complied',
        Status: 'Approved',
        Remark: 'Missing Information in uploaded Document'
      },
      {
        Compliance_Instance_ID: 1008,
        Compliance_ID: 1023,
        IHRC_Company_Name: "AgroFresh",
        Location: "HMVL - Office - Gaya - Adalatganj - HR/ Gaya/ Bihar/ Office",
        Legislation: "Food Safety and Standards Act, 2006",
        Compliance_Categorization: "Food Safety",
        Compliance_Header: "FSSAI License Renewal",
        Compliance_Description: "Renewal of FSSAI license for food business",
        Penalty_Description: "License cancellation and fines up to ₹5 lakhs",
        Compliance_Applicability: "All food businesses",
        Bare_Act_Text: "Food business operator shall renew FSSAI license before expiry",
        Compliance_Clause: "Section 31",
        Compliance_Type: "Licensing",
        Compliance_Frequency: "Annual",
        Compliance_Statutory_Authority: "Food Safety and Standards Authority of India",
        Approval_Required: true,
        Criticality: "High",
        Penalty_Type: "Monetary and Operational",
        Default_Due_Date: "30 days before license expiry",
        First_Due_Date: "2024-05-15",
        Due_Date: new Date("2024-05-15"),
        Scheduled_Frequency: "Yearly",
        Proof_Of_Compliance_Mandatory: true,
        Owner_Name: "Rajesh Patel",
        Owner_User_Name: "rajesh.patel@agrofresh.com",
        Approver_Name: "Meera Shah",
        Approver_User_Name: "meera.shah@agrofresh.com",
        Reminder: "60 days before due date",
        Effective_Date_Of_Change: "2023-05-15",
        Reason_To_Edit: "Updated due to new FSSAI guidelines",
        Edited_On: "2023-05-20",
        Edited_By: "Quality Manager",
        Compliance_Status: 'Complied',
        Status: 'Approved',
        Remark: 'Missing Information in uploaded Document'
      },
      {
        Compliance_Instance_ID: 1009,
        Compliance_ID: 1134,
        IHRC_Company_Name: "EduTech",
        Location: "HMVL - Office - Purnea - Line Bazar - HR/ Purnea/ Bihar/ Office",
        Legislation: "West Bengal Right of Children to Free and Compulsory Education Rules, 2012",
        Compliance_Categorization: "Education",
        Compliance_Header: "Student-Teacher Ratio Compliance",
        Compliance_Description: "Maintaining prescribed student-teacher ratio",
        Penalty_Description: "License cancellation and fines up to ₹5 lakhs",
        Compliance_Applicability: "All food businesses",
        Bare_Act_Text: "Food business operator shall renew FSSAI license before expiry",
        Compliance_Clause: "Section 31",
        Compliance_Type: "Licensing",
        Compliance_Frequency: "Annual",
        Compliance_Statutory_Authority: "Food Safety and Standards Authority of India",
        Approval_Required: true,
        Criticality: "Low",
        Penalty_Type: "Monetary and Operational",
        Default_Due_Date: "30 days before license expiry",
        First_Due_Date: "2024-05-15",
        Due_Date: new Date("2024-05-15"),
        Scheduled_Frequency: "Yearly",
        Proof_Of_Compliance_Mandatory: true,
        Owner_Name: "Rajesh Patel",
        Owner_User_Name: "rajesh.patel@agrofresh.com",
        Approver_Name: "Meera Shah",
        Approver_User_Name: "meera.shah@agrofresh.com",
        Reminder: "60 days before due date",
        Effective_Date_Of_Change: "2023-05-15",
        Reason_To_Edit: "Updated due to new FSSAI guidelines",
        Edited_On: "2023-05-20",
        Edited_By: "Quality Manager",
        Compliance_Status: 'Complied',
        Status: 'Approved',
        Remark: 'Missing Information in uploaded Document'

      },
      {
        Compliance_Instance_ID: 1010,
        Compliance_ID: 1245,
        IHRC_Company_Name: "GreenEnergy Solar",
        Location: "HMVL - Office - Chhapra - Rajendra Nagar - HR/ Chhapra/ Bihar/ Office",
        Legislation: "Electricity Act, 2003",
        Compliance_Categorization: "Energy",
        Compliance_Header: "Renewable Energy Certificate Filing",
        Compliance_Description: "Quarterly filing for Renewable Energy Certificates",
        Penalty_Description: "Revocation of power distribution license",
        Compliance_Applicability: "All solar power generators above 1 MW capacity",
        Bare_Act_Text: "Eligible entities shall file for RECs as per CERC regulations",
        Compliance_Clause: "Section 66",
        Compliance_Type: "Reporting",
        Compliance_Frequency: "Quarterly",
        Compliance_Statutory_Authority: "Central Electricity Regulatory Commission",
        Approval_Required: true,
        Criticality: "High",
        Penalty_Type: "Operational",
        Default_Due_Date: "15th of the first month of each quarter",
        First_Due_Date: "2023-07-15",
        Due_Date: new Date("2024-10-15"),
        Scheduled_Frequency: "Quarterly",
        Proof_Of_Compliance_Mandatory: true,
        Owner_Name: "Sunita Sharma",
        Owner_User_Name: "sunita.sharma@greenenergysolar.com",
        Approver_Name: "Rahul Mehra",
        Approver_User_Name: "rahul.mehra@greenenergysolar.com",
        Reminder: "14 days before due date",
        Effective_Date_Of_Change: "2023-04-01",
        Reason_To_Edit: "Updated due to new CERC guidelines",
        Edited_On: "2023-04-05",
        Edited_By: "Compliance Officer",
        Compliance_Status: 'Complied',
        Status: 'Approved',
        Remark: 'Missing Information in uploaded Document'
      },
      {
        Compliance_Instance_ID: 1011,
        Compliance_ID: 1356,
        IHRC_Company_Name: "CyberDefend",
        Location: "HMVL - Office - Katihar - Binodpur - HR/ Katihar/ Bihar/ Office",
        Legislation: "Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021",
        Compliance_Categorization: "IT",
        Compliance_Header: "Grievance Redressal Mechanism",
        Compliance_Description: "Establishment and maintenance of a grievance redressal mechanism",
        Penalty_Description: "Loss of intermediary status and legal action",
        Compliance_Applicability: "All social media intermediaries",
        Bare_Act_Text: "Intermediaries shall establish a grievance redressal mechanism and resolve complaints within 15 days",
        Compliance_Clause: "Rule 3(2)",
        Compliance_Type: "Operational",
        Compliance_Frequency: "Ongoing",
        Compliance_Statutory_Authority: "Ministry of Electronics and Information Technology",
        Approval_Required: false,
        Criticality: "High",
        Penalty_Type: "Legal",
        Default_Due_Date: "Ongoing",
        First_Due_Date: "2023-02-25",
        Due_Date: "",
        Scheduled_Frequency: "Daily",
        Proof_Of_Compliance_Mandatory: true,
        Owner_Name: "Arjun Reddy",
        Owner_User_Name: "arjun.reddy@cyberdefend.com",
        Approver_Name: "Nisha Patel",
        Approver_User_Name: "nisha.patel@cyberdefend.com",
        Reminder: "Daily",
        Effective_Date_Of_Change: "2023-02-25",
        Reason_To_Edit: "Implemented as per new IT Rules",
        Edited_On: "2023-02-26",
        Edited_By: "Legal Head",
        Compliance_Status: 'Complied',
        Status: 'Approved',
        Remark: 'Missing Information in uploaded Document'
      },
      {
        Compliance_Instance_ID: 1012,
        Compliance_ID: 1467,
        IHRC_Company_Name: "UrbanMove",
        Location: "HMVL - Office - Munger - Lal Darwaza - HR/ Munger/ Bihar/ Office",
        Legislation: "Motor Vehicles Act, 1988",
        Compliance_Categorization: "Transportation",
        Compliance_Header: "Vehicle Fitness Certificate Renewal",
        Compliance_Description: "Renewal of fitness certificate for commercial vehicles",
        Penalty_Description: "Fines up to ₹10,000 and vehicle impoundment",
        Compliance_Applicability: "All commercial vehicle operators",
        Bare_Act_Text: "Every transport vehicle shall carry a valid certificate of fitness",
        Compliance_Clause: "Section 56",
        Compliance_Type: "Certification",
        Compliance_Frequency: "Annual",
        Compliance_Statutory_Authority: "Regional Transport Office",
        Approval_Required: true,
        Criticality: "Low",
        Penalty_Type: "Monetary and Operational",
        Default_Due_Date: "30 days before certificate expiry",
        First_Due_Date: "2024-03-15",
        Due_Date: new Date("2024-03-15"),
        Scheduled_Frequency: "Yearly",
        Proof_Of_Compliance_Mandatory: true,
        Owner_Name: "Rakesh Yadav",
        Owner_User_Name: "rakesh.yadav@urbanmove.com",
        Approver_Name: "Preeti Gupta",
        Approver_User_Name: "preeti.gupta@urbanmove.com",
        Reminder: "45 days before due date",
        Effective_Date_Of_Change: "2023-03-15",
        Reason_To_Edit: "Updated due to new RTO regulations",
        Edited_On: "2023-03-20",
        Edited_By: "Fleet Manager",
        Compliance_Status: 'Complied',
        Status: 'Approved',
        Remark: 'Missing Information in uploaded Document'
      },
      {
        Compliance_Instance_ID: 1013,
        Compliance_ID: 1578,
        IHRC_Company_Name: "AquaPure",
        Location: "HMVL - Office - Bettiah - Janki Nagar - HR/ Bettiah/ Bihar/ Office",
        Legislation: "Water (Prevention and Control of Pollution) Act, 1974",
        Compliance_Categorization: "Environmental",
        Compliance_Header: "Effluent Treatment Plant Inspection",
        Compliance_Description: "Quarterly inspection of effluent treatment plant",
        Penalty_Description: "Fines up to ₹10,000 per day of failure and imprisonment up to 7 years",
        Compliance_Applicability: "All industries discharging effluents",
        Bare_Act_Text: "Every industry shall treat its effluents as per prescribed standards before discharge",
        Compliance_Clause: "Section 24",
        Compliance_Type: "Inspection",
        Compliance_Frequency: "Quarterly",
        Compliance_Statutory_Authority: "State Pollution Control Board",
        Approval_Required: true,
        Criticality: "High",
        Penalty_Type: "Monetary and Legal",
        Default_Due_Date: "Last day of each quarter",
        First_Due_Date: "2023-09-30",
        Due_Date: new Date("2024-09-30"),
        Scheduled_Frequency: "Quarterly",
        Proof_Of_Compliance_Mandatory: true,
        Owner_Name: "Sanjay Mohanty",
        Owner_User_Name: "sanjay.mohanty@aquapure.com",
        Approver_Name: "Ritu Panda",
        Approver_User_Name: "ritu.panda@aquapure.com",
        Reminder: "15 days before due date",
        Effective_Date_Of_Change: "2023-07-01",
        Reason_To_Edit: "Updated due to new effluent standards",
        Edited_On: "2023-07-05",
        Edited_By: "Environmental Engineer",
        Compliance_Status: 'Not Complied',
        Status: 'Rejected',
        Remark: 'Missing Information in uploaded Document'
      },
      {
        Compliance_Instance_ID: 1014,
        Compliance_ID: 1689,
        IHRC_Company_Name: "SkySafe Airlines",
        Location: "HMVL - Office - Hajipur - Bailey Road - HR/ Hajipur/ Bihar/ Office",
        Legislation: "Aircraft Rules, 1937",
        Compliance_Categorization: "Aviation",
        Compliance_Header: "Aircraft Maintenance Check",
        Compliance_Description: "Mandatory maintenance check for commercial aircraft",
        Penalty_Description: "Grounding of aircraft and suspension of operating license",
        Compliance_Applicability: "All commercial airlines",
        Bare_Act_Text: "Every aircraft shall undergo maintenance checks as per prescribed intervals",
        Compliance_Clause: "Rule 60",
        Compliance_Type: "Maintenance",
        Compliance_Frequency: "As per aircraft type and usage",
        Compliance_Statutory_Authority: "Directorate General of Civil Aviation",
        Approval_Required: true,
        Criticality: "High",
        Penalty_Type: "Operational",
        Default_Due_Date: "As per individual aircraft schedule",
        First_Due_Date: "2023-10-15",
        Due_Date: new Date("2024-10-15"),
        Scheduled_Frequency: "Varies",
        Proof_Of_Compliance_Mandatory: true,
        Owner_Name: "Capt. Aditya Sharma",
        Owner_User_Name: "aditya.sharma@skysafe.com",
        Approver_Name: "Eng. Priya Desai",
        Approver_User_Name: "priya.desai@skysafe.com",
        Reminder: "30 days before due date",
        Effective_Date_Of_Change: "2023-01-01",
        Reason_To_Edit: "Updated due to new DGCA guidelines",
        Edited_On: "2023-01-05",
        Edited_By: "Chief of Maintenance",
        Compliance_Status: 'Not Complied',
        Status: 'Rejected',
        Remark: 'Missing Information in uploaded Document'
      },
      {
        Compliance_Instance_ID: 1015,
        Compliance_ID: 1790,
        IHRC_Company_Name: "DigiBank",
        Location: "HMVL - Office - Siwan - Station Road - HR/ Siwan/ Bihar/ Office",
        Legislation: "Reserve Bank of India (Know Your Customer (KYC)) Directions, 2016",
        Compliance_Categorization: "Banking",
        Compliance_Header: "KYC Updation",
        Compliance_Description: "Periodic updation of Know Your Customer details",
        Penalty_Description: "Fines up to ₹1 crore and restrictions on banking operations",
        Compliance_Applicability: "All scheduled commercial banks",
        Bare_Act_Text: "Banks shall carry out periodic updation of KYC for existing customers",
        Compliance_Clause: "Section 38",
        Compliance_Type: "Documentation",
        Compliance_Frequency: "As per risk category (2-10 years)",
        Compliance_Statutory_Authority: "Reserve Bank of India",
        Approval_Required: true,
        Criticality: "Low",
        Penalty_Type: "Monetary and Operational",
        Default_Due_Date: "Based on customer risk category",
        First_Due_Date: "2023-12-31",
        Due_Date: new Date("2024-12-31"),
        Scheduled_Frequency: "Varies",
        Proof_Of_Compliance_Mandatory: true,
        Owner_Name: "Vikram Mehta",
        Owner_User_Name: "vikram.mehta@digibank.com",
        Approver_Name: "Anjali Nair",
        Approver_User_Name: "anjali.nair@digibank.com",
        Reminder: "90 days before due date",
        Effective_Date_Of_Change: "2023-01-01",
        Reason_To_Edit: "Updated as per latest RBI circular",
        Edited_On: "2023-01-10",
        Edited_By: "Compliance Head",
        Compliance_Status: 'Not Complied',
        Status: 'Rejected',
        Remark: 'Missing Information in uploaded Document'
      }
  ];