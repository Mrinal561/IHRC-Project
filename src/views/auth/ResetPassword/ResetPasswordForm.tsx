// import { useState } from 'react'
// import { FormItem, FormContainer } from '@/components/ui/Form'
// import Button from '@/components/ui/Button'
// import Alert from '@/components/ui/Alert'
// import PasswordInput from '@/components/shared/PasswordInput'
// import ActionLink from '@/components/shared/ActionLink'
// import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
// import { useNavigate, useSearchParams } from 'react-router-dom'
// import { Field, Form, Formik } from 'formik'
// import * as Yup from 'yup'
// import { useDispatch } from 'react-redux'
// import type { CommonProps } from '@/@types/common'
// import { clearState, resetPassword } from '@/store/slices/password/passwordSlice'

// interface ResetPasswordFormProps extends CommonProps {
//     disableSubmit?: boolean
//     signInUrl?: string
// }

// type ResetPasswordFormSchema = {
//     password: string
//     confirmPassword: string
// }

// const validationSchema = Yup.object().shape({
//     password: Yup.string().required('Please enter your password'),
//     confirmPassword: Yup.string().oneOf(
//         [Yup.ref('password')],
//         'Your passwords do not match'
//     ),
// })

// const ResetPasswordForm = (props: ResetPasswordFormProps) => {
//     const { disableSubmit = false, className, signInUrl = '/sign-in' } = props

//     const [searchParams] = useSearchParams()
//     const token = searchParams.get('token')
    
//     const dispatch = useDispatch()
//     const navigate = useNavigate()
//     const [message, setMessage] = useTimeOutMessage()
//     const [isLoading, setIsLoading] = useState(false)
//     const [success, setSuccess] = useState(false)

//     // Redirect if no token is present
//     useState(() => {
//         if (!token) {
//             setMessage('Invalid or missing reset token')
//             navigate(signInUrl)
//         }
//     }, [token, navigate, signInUrl])

//     // Cleanup on unmount
//     useState(() => {
//         return () => {
//             dispatch(clearState())
//         }
//     }, [dispatch])

//     const onSubmit = async (
//         values: ResetPasswordFormSchema,
//         setSubmitting: (isSubmitting: boolean) => void
//     ) => {
//         setIsLoading(true)
        
//         if (!token) {
//             setMessage('Invalid or missing reset token')
//             setIsLoading(false)
//             setSubmitting(false)
//             return
//         }

//         try {
//             // Only send token and newPassword in the payload
//             await dispatch(resetPassword({
//                 token,
//                 newPassword: values.password
//             })).unwrap()
            
//             setSuccess(true)
//             setIsLoading(false)
//             setSubmitting(false)
//         } catch (error: any) {
//             setMessage(error.toString())
//             setIsLoading(false)
//             setSubmitting(false)
//         }
//     }

//     const onContinue = () => {
//         navigate(signInUrl)
//     }

//     return (
//         <div className={className}>
//             <div className="mb-6">
//                 {success ? (
//                     <>
//                         <h3 className="mb-1">Reset done</h3>
//                         <p>Your password has been successfully reset</p>
//                     </>
//                 ) : (
//                     <>
//                         <h3 className="mb-1">Set new password</h3>
//                         <p>
//                             Your new password must be different 
//                         </p>
//                     </>
//                 )}
//             </div>
//             {message && (
//                 <Alert showIcon className="mb-4" type="danger">
//                     {message}
//                 </Alert>
//             )}
//             <Formik
//                 initialValues={{
//                     password: '',
//                     confirmPassword: '',
//                 }}
//                 validationSchema={validationSchema}
//                 onSubmit={(values, { setSubmitting }) => {
//                     if (!disableSubmit) {
//                         onSubmit(values, setSubmitting)
//                     } else {
//                         setSubmitting(false)
//                     }
//                 }}
//             >
//                 {({ touched, errors, isSubmitting }) => (
//                     <Form>
//                         <FormContainer>
//                             {!success ? (
//                                 <>
//                                     <FormItem
//                                         label="Password"
//                                         invalid={
//                                             errors.password && touched.password
//                                         }
//                                         errorMessage={errors.password}
//                                     >
//                                         <Field
//                                             autoComplete="off"
//                                             name="password"
//                                             placeholder="Password"
//                                             component={PasswordInput}
//                                         />
//                                     </FormItem>
//                                     <FormItem
//                                         label="Confirm Password"
//                                         invalid={
//                                             errors.confirmPassword &&
//                                             touched.confirmPassword
//                                         }
//                                         errorMessage={errors.confirmPassword}
//                                     >
//                                         <Field
//                                             autoComplete="off"
//                                             name="confirmPassword"
//                                             placeholder="Confirm Password"
//                                             component={PasswordInput}
//                                         />
//                                     </FormItem>
//                                     <Button
//                                         block
//                                         loading={isLoading || isSubmitting}
//                                         variant="solid"
//                                         type="submit"
//                                     >
//                                         {isLoading ? 'Submitting...' : 'Submit'}
//                                     </Button>
//                                 </>
//                             ) : (
//                                 <Button
//                                     block
//                                     variant="solid"
//                                     type="button"
//                                     onClick={onContinue}
//                                 >
//                                     Continue
//                                 </Button>
//                             )}

//                             <div className="mt-4 text-center">
//                                 <span>Back to </span>
//                                 <ActionLink to={signInUrl}>Sign in</ActionLink>
//                             </div>
//                         </FormContainer>
//                     </Form>
//                 )}
//             </Formik>
//         </div>
//     )
// }

// export default ResetPasswordForm




import { useState, useEffect } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import type { CommonProps } from '@/@types/common'
import { clearState, resetPassword } from '@/store/slices/password/passwordSlice'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'

interface ResetPasswordFormProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
}

type ResetPasswordFormSchema = {
    password: string
    confirmPassword: string
}

const validationSchema = Yup.object().shape({
    password: Yup.string().required('Please enter your password'),
    confirmPassword: Yup.string().oneOf(
        [Yup.ref('password')],
        'Your passwords do not match'
    ),
})

const ResetPasswordForm = (props: ResetPasswordFormProps) => {
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props

    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [message, setMessage] = useTimeOutMessage()
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [tokenValid, setTokenValid] = useState(false)
    const [tokenChecked, setTokenChecked] = useState(false)

    // Verify token on component mount
    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setMessage('Invalid or missing reset token')
                navigate(signInUrl)
                return
            }

            try {
                setIsLoading(true)
                // Add a new endpoint for token verification
                const response = await httpClient.post(endpoints.forgotpassword.verifyToken(), { token })
                setTokenValid(response.data.valid)
                setTokenChecked(true)
                setIsLoading(false)
            } catch (error) {
                setMessage('This reset link has expired or already been used')
                setTokenValid(false)
                setTokenChecked(true)
                setIsLoading(false)
            }
        }

        verifyToken()
    }, [token, navigate, signInUrl, setMessage])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            dispatch(clearState())
        }
    }, [dispatch])

    const onSubmit = async (
        values: ResetPasswordFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setIsLoading(true)
        
        if (!token || !tokenValid) {
            setMessage('Invalid or expired reset token')
            setIsLoading(false)
            setSubmitting(false)
            return
        }

        try {
            await dispatch(resetPassword({
                token,
                newPassword: values.password,
                // confirmPassword: values.confirmPassword
            })).unwrap()
            
            setSuccess(true)
            setIsLoading(false)
            setSubmitting(false)
        } catch (error: any) {
            setMessage(error.toString())
            setIsLoading(false)
            setSubmitting(false)
        }
    }

    const onContinue = () => {
        navigate(signInUrl)
    }

    // Render appropriate content based on token validation
    if (isLoading && !tokenChecked) {
        return (
            <div className={className}>
                <div className="mb-6 text-center">
                    <h3 className="mb-1">Verifying reset link...</h3>
                </div>
            </div>
        )
    }

    if (!tokenValid && tokenChecked) {
        return (
            <div className={className}>
                <div className="mb-6">
                    <h3 className="mb-1">Invalid Reset Link</h3>
                    <p>This password reset link has expired or already been used.</p>
                </div>
                <Button
                    block
                    variant="solid"
                    type="button"
                    onClick={() => navigate(signInUrl)}
                >
                    Return to Sign In
                </Button>
            </div>
        )
    }

    return (
        <div className={className}>
            <div className="mb-6">
                {success ? (
                    <>
                        <h3 className="mb-1">Reset done</h3>
                        <p>Your password has been successfully reset</p>
                    </>
                ) : (
                    <>
                        <h3 className="mb-1">Set new password</h3>
                        <p>
                            Your new password must be different and at least 8 characters
                        </p>
                    </>
                )}
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={{
                    password: '',
                    confirmPassword: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSubmit(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            {!success ? (
                                <>
                                    <FormItem
                                        label="Password"
                                        invalid={
                                            errors.password && touched.password
                                        }
                                        errorMessage={errors.password}
                                    >
                                        <Field
                                            autoComplete="off"
                                            name="password"
                                            placeholder="Password"
                                            component={PasswordInput}
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="Confirm Password"
                                        invalid={
                                            errors.confirmPassword &&
                                            touched.confirmPassword
                                        }
                                        errorMessage={errors.confirmPassword}
                                    >
                                        <Field
                                            autoComplete="off"
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            component={PasswordInput}
                                        />
                                    </FormItem>
                                    <Button
                                        block
                                        loading={isLoading || isSubmitting}
                                        variant="solid"
                                        type="submit"
                                    >
                                        {isLoading ? 'Submitting...' : 'Submit'}
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    block
                                    variant="solid"
                                    type="button"
                                    onClick={onContinue}
                                >
                                    Continue
                                </Button>
                            )}

                            <div className="mt-4 text-center">
                                <span>Back to </span>
                                <ActionLink to={signInUrl}>Sign in</ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ResetPasswordForm