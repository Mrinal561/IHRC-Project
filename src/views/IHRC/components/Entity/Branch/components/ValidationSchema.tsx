// import * as Yup from 'yup';

// const validationSchema = Yup.object().shape({
//     group_id: Yup.number()
//         .required('Company Group is required')
//         .min(1, 'Please select a Company Group'),
    
//     company_id: Yup.number()
//         .required('Company is required')
//         .min(1, 'Please select a Company'),
    
//     state_id: Yup.number()
//         .required('State is required')
//         .min(1, 'Please select a State'),
    
//     district: Yup.string()
//         .required('District is required')
//         .min(2, 'District must be at least 2 characters'),
    
//     location: Yup.string()
//         .required('Location is required')
//         .min(2, 'Location must be at least 2 characters'),
    
//     name: Yup.string()
//         .required('Branch Name is required')
//         .min(2, 'Branch Name must be at least 2 characters'),
    
//     opening_date: Yup.string()
//         .required('Opening Date is required'),
    
//     head_count: Yup.string()
//         .required('Head Count is required')
//         .matches(/^[0-9]+$/, 'Must be a valid number'),
    
//     address: Yup.string()
//         .required('Address is required')
//         .min(10, 'Address must be at least 10 characters'),
    
//     type: Yup.string()
//         .when('office_mode', {
//             is: 'physical',
//             then: Yup.string().required('Branch Type is required')
//         }),
    
//     office_type: Yup.string()
//         .when('office_mode', {
//             is: 'physical',
//             then: Yup.string().required('Office Type is required')
//         }),
    
//     other_office: Yup.string()
//         .when('office_type', {
//             is: 'other',
//             then: Yup.string().required('Other Office Type is required')
//         }),
    
//     office_mode: Yup.string()
//         .required('Office Mode is required')
//         .oneOf(['physical', 'virtual']),
    
//     gst_number: Yup.string()
//         .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST Number format')
//         .nullable(),
    
//     custom_data: Yup.object().shape({
//         email: Yup.string()
//             .email('Invalid email format')
//             .nullable(),
//         mobile: Yup.string()
//             .matches(/^[0-9]{10}$/, 'Mobile must be 10 digits')
//             .nullable(),
//         remark: Yup.string().nullable(),
//         status: Yup.string().required()
//     }),
    
//     // Conditional validations for rented type
//     lease_status: Yup.string()
//         .when(['type', 'office_mode'], {
//             is: (type: string, office_mode: string) => type === 'rented' && office_mode === 'physical',
//             then: Yup.string().required('Lease Status is required')
//         }),
    
//     lease_validity: Yup.string()
//         .when(['type', 'office_mode'], {
//             is: (type: string, office_mode: string) => type === 'rented' && office_mode === 'physical',
//             then: Yup.string().required('Lease Validity is required')
//         }),
    
//     lease_document: Yup.string()
//         .when(['type', 'office_mode'], {
//             is: (type: string, office_mode: string) => type === 'rented' && office_mode === 'physical',
//             then: Yup.string().required('Lease Document is required')
//         }),
    
//     // SE Registration validations
//     register_number: Yup.string()
//         .when(['se_status', 'office_mode'], {
//             is: (se_status: string, office_mode: string) => 
//                 (se_status === 'valid' || se_status === 'expired') && office_mode === 'physical',
//             then: Yup.string().required('SE Registration Number is required')
//         }),
    
//     se_validity: Yup.string()
//         .when(['se_status', 'document_validity_type', 'office_mode'], {
//             is: (se_status: string, document_validity_type: string, office_mode: string) => 
//                 se_status === 'valid' && document_validity_type === 'fixed' && office_mode === 'physical',
//             then: Yup.string().required('SE Validity is required')
//         }),
    
//     se_document: Yup.string()
//         .when('office_mode', {
//             is: 'physical',
//             then: Yup.string().required('SE Document is required')
//         }),

//     // Agreement validations
//     agreement_data: Yup.array().of(
//         Yup.object().shape({
//             agreement_type: Yup.string().required('Agreement Type is required'),
//             start_date: Yup.string().required('Start Date is required'),
//             end_date: Yup.string().required('End Date is required'),
//             owner_name: Yup.string().required("Owner's Name is required"),
//             partner_name: Yup.string().required("Partner's Name is required"),
//             partner_contact: Yup.string()
//                 .required("Partner's Contact is required")
//                 .matches(/^[0-9]{10}$/, 'Contact must be 10 digits'),
//             agreement_document: Yup.string().nullable()
//         })
//     )
// });

// export default validationSchema;





import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    group_id: Yup.number()
        .required('Company Group is required')
        .min(1, 'Please select a Company Group'),
    
    company_id: Yup.number()
        .required('Company is required')
        .min(1, 'Please select a Company'),
    
    state_id: Yup.number()
        .required('State is required')
        .min(1, 'Please select a State'),
    
    district: Yup.string()
        .required('District is required')
        .min(2, 'District must be at least 2 characters'),
    
    location: Yup.string()
        .required('Location is required')
        .min(2, 'Location must be at least 2 characters'),
    
    name: Yup.string()
        .required('Branch Name is required')
        .min(2, 'Branch Name must be at least 2 characters'),
    
    opening_date: Yup.string()
        .required('Opening Date is required'),
    
    head_count: Yup.string()
        .required('Head Count is required')
        .matches(/^[0-9]+$/, 'Must be a valid number'),
    
    address: Yup.string()
        .required('Address is required')
        .min(10, 'Address must be at least 10 characters'),
    
    type: Yup.string()
        .when('office_mode', {
            is: 'physical',
            then: Yup.string().required('Branch Type is required')
        }),
    
    office_type: Yup.string()
        .when('office_mode', {
            is: 'physical',
            then: Yup.string().required('Office Type is required')
        }),
    
    other_office: Yup.string()
        .when('office_type', {
            is: 'other',
            then: Yup.string().required('Other Office Type is required')
        }),
    
    office_mode: Yup.string()
        .required('Office Mode is required')
        .oneOf(['physical', 'virtual']),
    
    gst_number: Yup.string()
        .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST Number format')
        .nullable(),
    
    custom_data: Yup.object().shape({
        email: Yup.string()
            .email('Invalid email format')
            .nullable(),
        mobile: Yup.string()
            .matches(/^[0-9]{10}$/, 'Mobile must be 10 digits')
            .nullable(),
        remark: Yup.string().nullable(),
        status: Yup.string().required()
    }),
    
    // Conditional validations for rented type
    lease_status: Yup.string()
        .when(['type', 'office_mode'], {
            is: (type: string, office_mode: string) => type === 'rented' && office_mode === 'physical',
            then: Yup.string().required('Lease Status is required')
        }),
    
    lease_validity: Yup.string()
        .when(['type', 'office_mode'], {
            is: (type: string, office_mode: string) => type === 'rented' && office_mode === 'physical',
            then: Yup.string().required('Lease Validity is required')
        }),
    
    lease_document: Yup.string()
        .when(['type', 'office_mode'], {
            is: (type: string, office_mode: string) => type === 'rented' && office_mode === 'physical',
            then: Yup.string().required('Lease Document is required')
        }),
    
    // SE Registration validations
    register_number: Yup.string()
        .when(['se_status', 'office_mode'], {
            is: (se_status: string, office_mode: string) => 
                (se_status === 'valid' || se_status === 'expired') && office_mode === 'physical',
            then: Yup.string().required('SE Registration Number is required')
        }),
    
    se_validity: Yup.string()
        .when(['se_status', 'document_validity_type', 'office_mode'], {
            is: (se_status: string, document_validity_type: string, office_mode: string) => 
                se_status === 'valid' && document_validity_type === 'fixed' && office_mode === 'physical',
            then: Yup.string().required('SE Validity is required')
        }),
    
    se_document: Yup.string()
        .when('office_mode', {
            is: 'physical',
            then: Yup.string().required('SE Document is required')
        }),

    // Agreement validations
    agreement_data: Yup.array().of(
        Yup.object().shape({
            agreement_type: Yup.string().required('Agreement Type is required'),
            start_date: Yup.string().required('Start Date is required'),
            end_date: Yup.string().required('End Date is required'),
            owner_name: Yup.string().required("Owner's Name is required"),
            partner_name: Yup.string().required("Partner's Name is required"),
            partner_contact: Yup.string()
                .required("Partner's Contact is required")
                .matches(/^[0-9]{10}$/, 'Contact must be 10 digits'),
            agreement_document: Yup.string().nullable()
        })
    )
});

export default validationSchema;