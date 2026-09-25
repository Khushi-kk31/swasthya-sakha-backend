export const roles=[
 {id:'patient',label:'Patient',hint:'ABHA / mobile access'},
 {id:'healthWorker',label:'Health Worker',hint:'Field & PHC operations'},
 {id:'doctor',label:'Doctor',hint:'Clinical workspace'},
 {id:'facilityAdmin',label:'Facility Admin',hint:'Facility resources'},
 {id:'districtAdmin',label:'District Admin',hint:'District command centre'}
];
export const facilities=[
 {id:1,name:'District Hospital',type:'District Hospital',lat:19.0760,lng:72.8777,beds:180,icu:24,specialists:18,diagnostics:12,ambulances:5,status:'Open'},
 {id:2,name:'PHC Andheri East',type:'PHC',lat:19.1197,lng:72.8468,beds:30,icu:0,specialists:4,diagnostics:4,ambulances:1,status:'Open'},
 {id:3,name:'CHC Kurla',type:'CHC',lat:19.0726,lng:72.8798,beds:75,icu:8,specialists:9,diagnostics:7,ambulances:2,status:'Open'},
 {id:4,name:'Sub Centre Sakinaka',type:'Sub Centre',lat:19.1036,lng:72.8870,beds:8,icu:0,specialists:1,diagnostics:1,ambulances:0,status:'Open'},
 {id:5,name:'Urban PHC Powai',type:'PHC',lat:19.1176,lng:72.9060,beds:42,icu:0,specialists:5,diagnostics:5,ambulances:1,status:'Open'}
];
export const medicines=[
 {store:'Jan Aushadhi Store - Kurla',medicine:'Paracetamol 500mg',stock:420,reorder:100,status:'In stock'},
 {store:'Jan Aushadhi Store - Kurla',medicine:'Amoxicillin 500mg',stock:0,reorder:60,status:'Out of stock'},
 {store:'PHC Pharmacy - Andheri',medicine:'ORS Sachets',stock:210,reorder:50,status:'In stock'},
 {store:'PHC Pharmacy - Andheri',medicine:'Iron + Folic Acid',stock:34,reorder:80,status:'Low stock'},
 {store:'District Hospital Pharmacy',medicine:'Insulin',stock:18,reorder:20,status:'Low stock'},
 {store:'District Hospital Pharmacy',medicine:'Azithromycin',stock:0,reorder:30,status:'Out of stock'}
];
export const diagnostics=[
 {facility:'District Hospital',machine:'CT Scanner',available:1,total:1,status:'Operational'},
 {facility:'District Hospital',machine:'X-Ray',available:2,total:2,status:'Operational'},
 {facility:'CHC Kurla',machine:'Ultrasound',available:1,total:1,status:'Operational'},
 {facility:'CHC Kurla',machine:'Hematology Analyzer',available:0,total:1,status:'Under maintenance'},
 {facility:'PHC Andheri East',machine:'CBC Analyzer',available:1,total:1,status:'Operational'},
 {facility:'Urban PHC Powai',machine:'ECG',available:0,total:1,status:'Out of service'}
];
export const appointments=[
 {id:'APT-1042',patient:'Asha Patil',age:42,reason:'Follow-up — diabetes',doctor:'Dr. Meera Shah',time:'09:30 AM',status:'Waiting'},
 {id:'APT-1043',patient:'Rohan More',age:29,reason:'Fever & weakness',doctor:'Dr. Arjun Rao',time:'10:00 AM',status:'Checked in'},
 {id:'APT-1044',patient:'Sana Khan',age:36,reason:'BP review',doctor:'Dr. Meera Shah',time:'10:30 AM',status:'Upcoming'},
 {id:'APT-1045',patient:'Vijay Joshi',age:61,reason:'Cardiology referral',doctor:'Dr. Arjun Rao',time:'11:00 AM',status:'Priority'}
];
export const districtStats={centres:42,subCentres:118,districtHospitals:2,totalBeds:1840,icuBeds:146,specialists:214,ambulances:38,pharmacies:96,diagnosticCentres:31};
