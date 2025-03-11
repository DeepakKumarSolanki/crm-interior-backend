const leadFields = [
{
    "name": "leadName",
    "label": "Lead Name",
    "type": "name",
    "fixed": true,
    "delete": false,
    "belongsTo": null,
    "backendType": "String",
    "isTableField": true,
    "options": [],
    "validation": [
        {
            "require": true,
            "message": "",
        },
    ],
},
{
    "name": "leadEmail",
    "label": "Lead Email",
    "type": "email",
    "fixed": true,
    "delete": false,
    "belongsTo": null,
    "backendType": "String",
    "isTableField": true,
    "options": [],
    "validation": [
        {
            "require": false,
            "message": "",
        },
    ],
},
{
    "name": "leadPhoneNumber",
    "label": "Lead Phone Number",
    "type": "tel",
    "fixed": true,
    "delete": false,
    "belongsTo": null,
    "backendType": "String",
    "isTableField": true,
    "options": [],
    "validation": [
        {
            "require": true,
            "message": "",
        },
    ],
},
    {
        "name": "leadRemark",
        "label": "Lead Remark",
        "type": "select",
        "fixed": false,  
        "delete": false,
        "belongsTo": null,
        "backendType": "Mixed",
        "isTableField": true,
        "options": [
            {
                "name": "RNR", 
                "value": "rnr",
            },
            {
                "name": "Busy", 
                "value": "busy",
            },
            {
                "name": "Currenlty Not Interested", 
                "value": "currenltyNotInterested",
            },
            {
                "name": "Wants Interior After 90 Days", 
                "value": "wantsInteriorAfter90Days",
            },
            {
                "name": "Budget is Less Than 10 Lakhs", 
                "value": "budgetIsLessThan10Lakhs",
            },
            {
                "name": "Possesion More Than 90 Days", 
                "value": "possesionMoreThan90Days",
            },
            {
                "name": "Move in Criteria More Than 120 Days", 
                "value": "move-InCriteriaMoreThan120Days",
            },
           




            {
                "name": "Follow Up", 
                "value": "followUp",
            },

            {
                "name": "Site Visit Schedule", 
                "value": "siteVisitScheduled",
                "requiresDatePicker": true,
            },


            {
                "name": "Site Visit Reschedule", 
                "value": "re-ScheduleSiteVisit",
                "requiresDatePicker": true,
            },
            {
                "name": "Video Call Schedule", 
                "value": "vcScheduled",
                "requiresDatePicker": true,
            },
            {
                "name": "Video Call Reschedule", 
                "value": "re-RescheduleVCe",
                "requiresDatePicker": true,
            },

            {
                "name": "Office Visit Schedule", 
                "value": "inOfficeMeetingSchedule",
                "requiresDatePicker": true,
            },
            {
                "name": "Office Visit Reschedule", 
                "value": "re-ScheduleOfficeMeeting",
                "requiresDatePicker": true,
            },

            {
                "name": "Wants Interior Within 60-90 Days",
                "value": "wantsInteriorWithin60-90Days",
            },
           
          
            {
                "name": "Budget is More Than 10 Lakhs", 
                "value": "budgetIsMoreThan10Lakhs",
            },
            {
                "name": "Possesion Within 60-90 Days", 
                "value": "possesionWithin60-90Days",
            },
           
            {
                "name": "Move in Criteria Within 60-90 Days", 
                "value": "move-InCriteriaWithin60-90Days",
            },



            {
                "name": "Wants Interior Within A Month",
                "value" : "wantsInteriorWithinAMonth"
            },
            {
                "name": "Budget is More Than 30 Lakhs",
                "value" : "budgetIsMoreThan30Lakhs"
            },
            {
                "name": "Possesion Within 45-60 Days",
                "value" : "possesionWithin45-60Days"
            },
            {
                "name": "Move-In Criteria Within 30-60 Days",
                "value" : "move-InCriteriaWithin30-60Days"
            },




            {
                "name": "Out of Bangalore", 
                "value": "outOfBangalore",
            },
            {
                "name": "Not Looking For Interior", 
                "value": "notLookingForInterior",
            },
            {
                "name": "Not Purchased House", 
                "value": "notPurchasedHouse",
            },
            {
                "name": "Interior Already Done", 
                "value": "interiorAlreadyDon",
            },
            {
                "name": "Budget is Less Than 3 Lakhs", 
                "value": "budgetIsLessThan3Lakhs",
            },
            {
                "name": "Incorrect Contact Details", 
                "value": "incorrectContactDetails",
            },
        
            {
                "name": "Lead Lost",
                "value": "leadLost",
            }
          
        ],
        "validation": [
            {
                "message": "Invalid type value for Lead Remark",
                "formikType": "String",
            }
        ],
    },
    {
        "name": "comments",
        "label": "Comments",
        "type": "array",   // Change "text" to "array" to correctly indicate it's an array of objects
        "fixed": true,
        "delete": false,
        "belongsTo": null,
        "backendType": "array",  
        "isTableField": false,
        "options": [],
        "validation": [
            {
                "require": true,
                "message": "At least one comment is required"
            }
        ],
        "subFields": [ 
            {
                "name": "comment",
                "label": "Comment Text",
                "type": "text",
                "backendType": "String",
                "validation": [
                    {
                        "require": true,
                        "message": "Comment text is required"
                    }
                ]
            },
            {
                "name": "createdAt",
                "label": "Created At",
                "type": "date",
                "backendType": "Date",
                "default": "now"  // Automatically set timestamp
            }
        ]
    },    
    {
        "name": "leadStatus",
        "label": "Lead Status",
        "type": "select",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "Mixed",
        "isTableField": true,
        "options": [
            {
                "name": "HOT",
                "value": "hot",
            },
            {
                "name": "WARM",
                "value": "warm",
            },
            {
                "name": "COLD",
                "value": "cold",
            },{
                "name":"BOOKED",
                'value':'booked'
            }
        ],
        "validation": [
            {
                "message": "Invalid type value for Lead Status",
                "formikType": "String",
            }
        ],
    },
    {
        "name": "dateTime",
        "label": "Date-Time",
        "type": "datetime-local",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "Date",
        "isTableField": true,
        "options": [],
    },
    {
        "name": "origin",
        "label": "Lead Origin",
        "type": "select",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "Mixed",
        "isTableField": true,
        "options": [
          
            {
                "name": "Marketing", 
                "value": "marketing",
            },
            {
                "name": "Housing", 
                "value": "housing",
            },
            {
                "name": "Website",
                "value": "website",
            },
            {
                "name": "Others", 
                "value": "others",
            },
           
           
          
        ],
        "validation": [
            {
                "message": "Invalid type value for Lead Status",
                "formikType": "String",
            }
        ],
    },

    {
        name: "budget",
        label: "Budget",
        type: "number",
        fixed: false,
        delete: false,
        belongsTo: null,
        backendType: "Number",
        isTableField: true,
        options: [],
        validation: [
            {
                require: true,
                message: "Budget is required",
            },
        ],
    },
    {
        name: "type",
        label: "Type",
        type: "select",
        fixed: false,
        delete: false,
        belongsTo: null,
        backendType: "String",
        isTableField: true,
        options: [
            { name: "Apartment", value: "apartment" },
            { name: "Independent House", value: "independent_house" },
            { name: "Villas", value: "villas" },
        ],
        validation: [
            {
                require: true,
                message: "Type is required",
            },
        ],
    },
    {
        name: "location",
        label: "Location",
        type: "location",
        fixed: false,
        delete: false,
        belongsTo: null,
        backendType: "String",
        isTableField: true,
        "options": [],
        validation: [
            {
                require: true,
                message: "Location is required",
            },
        ],
    },

    {
        "name": "assignedTo",
        "label": "Assigned To",
        "type": "text",
        "fixed": true,
        "delete": false,
        "belongsTo": null,
        "backendType": "String",
        "isTableField": true,
        "options": [],
        "validation": [
            {
                "require": true,
                "message": "",
            },
        ],
    },
    
];

exports.leadFields = leadFields;