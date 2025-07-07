// // import React, { useState, useRef, useEffect, KeyboardEvent } from 'react'
// // import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'
// // import httpClient from '@/api/http-client'
// // import { endpoints } from '@/api/endpoint'
// // import OutlinedInput from '@/components/ui/OutlinedInput'

// // interface Location {
// //     id: number
// //     name: string
// //     district_id: number
// // }

// // interface LocationAutosuggestProps {
// //     value: string
// //     locationId?: number
// //     onChange: (value: string, locationId?: number) => void
// //     districtId?: number | null
// //     label?: string
// //     placeholder?: string
// // }

// // const LocationAutosuggest: React.FC<LocationAutosuggestProps> = ({
// //     value,
// //     locationId,
// //     onChange,
// //     districtId,
// //     label = 'Location',
// //     placeholder = 'Enter location',
// // }) => {
// //     const [isOpen, setIsOpen] = useState(false)
// //     const [locations, setLocations] = useState<Location[]>([])
// //     const [filteredLocations, setFilteredLocations] = useState<Location[]>([])
// //     const [isLoading, setIsLoading] = useState(false)
// //     const wrapperRef = useRef<HTMLDivElement>(null)
// //     const inputWrapperRef = useRef<HTMLDivElement>(null)

// //     useEffect(() => {
// //         const fetchLocations = async () => {
// //             if (!districtId) {
// //                 setLocations([])
// //                 return
// //             }

// //             setIsLoading(true)
// //             try {
// //                 const response = await httpClient.get(
// //                     endpoints.common.location(),
// //                     {
// //                         params: { district_id: districtId },
// //                     },
// //                 )
// //                 setLocations(response.data)
// //             } catch (error) {
// //                 console.error('Error fetching locations:', error)
// //                 setLocations([])
// //             } finally {
// //                 setIsLoading(false)
// //             }
// //         }

// //         if (districtId) {
// //             fetchLocations()
// //         }
// //     }, [districtId])

// //     useEffect(() => {
// //         const filtered = locations.filter((location) =>
// //             location.name.toLowerCase().includes(value.toLowerCase()),
// //         )
// //         setFilteredLocations(filtered)
// //     }, [value, locations])

// //     const handleCreateLocation = async (locationName: string) => {
// //         if (!districtId) return

// //         try {
// //             const response = await httpClient.post(
// //                 endpoints.common.location(),
// //                 {
// //                     name: locationName,
// //                     district_id: districtId,
// //                 },
// //             )
// //             const newLocation = response.data
// //             setLocations((prev) => [...prev, newLocation])
// //             onChange(locationName, newLocation.id)
// //             setIsOpen(false)
// //         } catch (error) {
// //             console.error('Error creating location:', error)
// //         }
// //     }

// //     const handleSelect = (location: Location) => {
// //         onChange(location.name, location.id)
// //         setIsOpen(false)
// //     }

// //     const handleInputChange = (inputValue: string) => {
// //         onChange(inputValue, undefined) // Clear locationId when input changes
// //         setIsOpen(true)
// //     }

// //     useEffect(() => {
// //         const handleClickOutside = (event: MouseEvent) => {
// //             if (
// //                 wrapperRef.current &&
// //                 !wrapperRef.current.contains(event.target as Node)
// //             ) {
// //                 setIsOpen(false)
// //             }
// //         }

// //         document.addEventListener('mousedown', handleClickOutside)
// //         return () =>
// //             document.removeEventListener('mousedown', handleClickOutside)
// //     }, [])

// //     const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
// //         if (event.key === 'Enter') {
// //             event.preventDefault()
// //             handleCreateLocation(value)
// //         }
// //     }

// //     return (
// //         <div className="relative" ref={wrapperRef}>
// //             <p className="mb-2">
// //                 {label} <span className="text-red-500">*</span>
// //             </p>
// //             <div
// //                 className="relative"
// //                 ref={inputWrapperRef}
// //                 onKeyDown={handleKeyDown}
// //                 tabIndex={-1}
// //             >
// //                 <OutlinedInput
// //                     value={value}
// //                     onChange={handleInputChange}
// //                     label={placeholder}
// //                 />
// //                 <button
// //                     onClick={() => districtId && setIsOpen(!isOpen)}
// //                     type="button"
// //                     className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
// //                     disabled={!districtId}
// //                 >
// //                     {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
// //                 </button>
// //             </div>

// //             {isOpen && (
// //                 <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
// //                     {isLoading ? (
// //                         <div className="p-2 text-gray-500">
// //                             Loading locations...
// //                         </div>
// //                     ) : filteredLocations.length > 0 ? (
// //                         <ul className="max-h-60 overflow-auto">
// //                             {filteredLocations.map((location) => (
// //                                 <li
// //                                     key={location.id}
// //                                     className="px-4 py-2 cursor-pointer hover:bg-gray-100"
// //                                     onClick={() => handleSelect(location)}
// //                                 >
// //                                     {location.name}
// //                                 </li>
// //                             ))}
// //                         </ul>
// //                     ) : value && !isLoading ? (
// //                         <div
// //                             className="p-2 text-gray-600 cursor-pointer hover:bg-gray-100"
// //                             onClick={() => handleCreateLocation(value)}
// //                         >
// //                             Press Enter to create location "{value}"
// //                         </div>
// //                     ) : (
// //                         <div className="p-2 text-gray-500">
// //                             {districtId
// //                                 ? 'No locations found'
// //                                 : 'Please select a district first'}
// //                         </div>
// //                     )}
// //                 </div>
// //             )}
// //         </div>
// //     )
// // }

// // export default LocationAutosuggest


// import React, { useState, useRef, useEffect, KeyboardEvent } from 'react'
// import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'
// import { AiOutlineLoading3Quarters } from 'react-icons/ai'
// import httpClient from '@/api/http-client'
// import { endpoints } from '@/api/endpoint'
// import OutlinedInput from '@/components/ui/OutlinedInput'

// interface Location {
//     id: number
//     name: string
//     district_id: number
// }

// interface LocationAutosuggestProps {
//     value: string
//     locationId?: number
//     onChange: (value: string, locationId?: number) => void
//     districtId?: number | null
//     label?: string
//     placeholder?: string
// }

// const LocationAutosuggest: React.FC<LocationAutosuggestProps> = ({
//     value,
//     locationId,
//     onChange,
//     districtId,
//     label = 'Location',
//     placeholder = 'Enter Location',
// }) => {
//     const [isOpen, setIsOpen] = useState(false)
//     const [locations, setLocations] = useState<Location[]>([])
//     const [filteredLocations, setFilteredLocations] = useState<Location[]>([])
//     const [isLoading, setIsLoading] = useState(false)
//     const [isCreating, setIsCreating] = useState(false)
//     const wrapperRef = useRef<HTMLDivElement>(null)
//     const inputWrapperRef = useRef<HTMLDivElement>(null)

//     useEffect(() => {
//         const fetchLocations = async () => {
//             if (!districtId) {
//                 setLocations([])
//                 return
//             }

//             setIsLoading(true)
//             try {
//                 const response = await httpClient.get(
//                     endpoints.common.location(),
//                     {
//                         params: { district_id: districtId },
//                     },
//                 )
//                 setLocations(response.data)
//             } catch (error) {
//                 console.error('Error fetching locations:', error)
//                 setLocations([])
//             } finally {
//                 setIsLoading(false)
//             }
//         }

//         if (districtId) {
//             fetchLocations()
//         }
//     }, [districtId])

//     useEffect(() => {
//         const filtered = locations.filter((location) =>
//             location.name.toLowerCase().includes(value.toLowerCase()),
//         )
//         setFilteredLocations(filtered)
//     }, [value, locations])

//     const handleCreateLocation = async (locationName: string) => {
//         if (!districtId || isCreating) return

//         setIsCreating(true)
//         try {
//             const response = await httpClient.post(
//                 endpoints.common.location(),
//                 {
//                     name: locationName,
//                     district_id: districtId,
//                 },
//             )
//             const newLocation = response.data
//             setLocations((prev) => [...prev, newLocation])
//             onChange(locationName, newLocation.id)
//             setIsOpen(false)
//         } catch (error) {
//             console.error('Error creating location:', error)
//         } finally {
//             setIsCreating(false)
//         }
//     }

//     const handleSelect = (location: Location) => {
//         onChange(location.name, location.id)
//         setIsOpen(false)
//     }

//     const handleInputChange = (inputValue: string) => {
//         onChange(inputValue, undefined)
//         setIsOpen(true)
//     }

//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (
//                 wrapperRef.current &&
//                 !wrapperRef.current.contains(event.target as Node)
//             ) {
//                 setIsOpen(false)
//             }
//         }

//         document.addEventListener('mousedown', handleClickOutside)
//         return () =>
//             document.removeEventListener('mousedown', handleClickOutside)
//     }, [])

//     const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
//         if (event.key === 'Enter') {
//             event.preventDefault()
//             handleCreateLocation(value)
//         }
//     }

//     return (
//         <div className="relative" ref={wrapperRef}>
//             <p className="mb-2">
//                 {label} <span className="text-red-500">*</span>
//             </p>
//             <div
//                 className="relative"
//                 ref={inputWrapperRef}
//                 onKeyDown={handleKeyDown}
//                 tabIndex={-1}
//             >
//                 <OutlinedInput
//                     value={value}
//                     onChange={handleInputChange}
//                     label={placeholder}
//                     disabled={isCreating}
//                 />
//                 <button
//                     onClick={() => districtId && setIsOpen(!isOpen)}
//                     type="button"
//                     className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
//                     disabled={!districtId || isCreating}
//                 >
//                     {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
//                 </button>
//             </div>

//             {isOpen && (
//                 <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
//                     {isLoading ? (
//                         <div className="p-2 text-gray-500 flex items-center justify-center">
//                             <AiOutlineLoading3Quarters className="animate-spin mr-2" />
//                             Loading locations...
//                         </div>
//                     ) : filteredLocations.length > 0 ? (
//                         <ul className="max-h-60 overflow-auto">
//                             {filteredLocations.map((location) => (
//                                 <li
//                                     key={location.id}
//                                     className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//                                     onClick={() => handleSelect(location)}
//                                 >
//                                     {location.name}
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : value && !isLoading ? (
//                         <div
//                             className={`p-2 text-gray-600 ${
//                                 isCreating 
//                                     ? 'cursor-wait bg-gray-50' 
//                                     : 'cursor-pointer hover:bg-gray-100'
//                             } flex items-center justify-center`}
//                             onClick={() => !isCreating && handleCreateLocation(value)}
//                         >
//                             {isCreating ? (
//                                 <>
//                                     <AiOutlineLoading3Quarters className="animate-spin mr-2" />
//                                     Creating location "{value}"...
//                                 </>
//                             ) : (
//                                 <>Press Enter to create location "{value}"</>
//                             )}
//                         </div>
//                     ) : (
//                         <div className="p-2 text-gray-500">
//                             {districtId
//                                 ? 'No locations found'
//                                 : 'Please select a district first'}
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     )
// }

// export default LocationAutosuggest





// import React, { useState, useRef, useEffect, KeyboardEvent } from 'react'
// import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'
// import httpClient from '@/api/http-client'
// import { endpoints } from '@/api/endpoint'
// import OutlinedInput from '@/components/ui/OutlinedInput'

// interface Location {
//     id: number
//     name: string
//     district_id: number
// }

// interface LocationAutosuggestProps {
//     value: string
//     locationId?: number
//     onChange: (value: string, locationId?: number) => void
//     districtId?: number | null
//     label?: string
//     placeholder?: string
// }

// const LocationAutosuggest: React.FC<LocationAutosuggestProps> = ({
//     value,
//     locationId,
//     onChange,
//     districtId,
//     label = 'Location',
//     placeholder = 'Enter location',
// }) => {
//     const [isOpen, setIsOpen] = useState(false)
//     const [locations, setLocations] = useState<Location[]>([])
//     const [filteredLocations, setFilteredLocations] = useState<Location[]>([])
//     const [isLoading, setIsLoading] = useState(false)
//     const wrapperRef = useRef<HTMLDivElement>(null)
//     const inputWrapperRef = useRef<HTMLDivElement>(null)

//     useEffect(() => {
//         const fetchLocations = async () => {
//             if (!districtId) {
//                 setLocations([])
//                 return
//             }

//             setIsLoading(true)
//             try {
//                 const response = await httpClient.get(
//                     endpoints.common.location(),
//                     {
//                         params: { district_id: districtId },
//                     },
//                 )
//                 setLocations(response.data)
//             } catch (error) {
//                 console.error('Error fetching locations:', error)
//                 setLocations([])
//             } finally {
//                 setIsLoading(false)
//             }
//         }

//         if (districtId) {
//             fetchLocations()
//         }
//     }, [districtId])

//     useEffect(() => {
//         const filtered = locations.filter((location) =>
//             location.name.toLowerCase().includes(value.toLowerCase()),
//         )
//         setFilteredLocations(filtered)
//     }, [value, locations])

//     const handleCreateLocation = async (locationName: string) => {
//         if (!districtId) return

//         try {
//             const response = await httpClient.post(
//                 endpoints.common.location(),
//                 {
//                     name: locationName,
//                     district_id: districtId,
//                 },
//             )
//             const newLocation = response.data
//             setLocations((prev) => [...prev, newLocation])
//             onChange(locationName, newLocation.id)
//             setIsOpen(false)
//         } catch (error) {
//             console.error('Error creating location:', error)
//         }
//     }

//     const handleSelect = (location: Location) => {
//         onChange(location.name, location.id)
//         setIsOpen(false)
//     }

//     const handleInputChange = (inputValue: string) => {
//         onChange(inputValue, undefined) // Clear locationId when input changes
//         setIsOpen(true)
//     }

//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (
//                 wrapperRef.current &&
//                 !wrapperRef.current.contains(event.target as Node)
//             ) {
//                 setIsOpen(false)
//             }
//         }

//         document.addEventListener('mousedown', handleClickOutside)
//         return () =>
//             document.removeEventListener('mousedown', handleClickOutside)
//     }, [])

//     const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
//         if (event.key === 'Enter') {
//             event.preventDefault()
//             handleCreateLocation(value)
//         }
//     }

//     return (
//         <div className="relative" ref={wrapperRef}>
//             <p className="mb-2">
//                 {label} <span className="text-red-500">*</span>
//             </p>
//             <div
//                 className="relative"
//                 ref={inputWrapperRef}
//                 onKeyDown={handleKeyDown}
//                 tabIndex={-1}
//             >
//                 <OutlinedInput
//                     value={value}
//                     onChange={handleInputChange}
//                     label={placeholder}
//                 />
//                 <button
//                     onClick={() => districtId && setIsOpen(!isOpen)}
//                     type="button"
//                     className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
//                     disabled={!districtId}
//                 >
//                     {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
//                 </button>
//             </div>

//             {isOpen && (
//                 <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
//                     {isLoading ? (
//                         <div className="p-2 text-gray-500">
//                             Loading locations...
//                         </div>
//                     ) : filteredLocations.length > 0 ? (
//                         <ul className="max-h-60 overflow-auto">
//                             {filteredLocations.map((location) => (
//                                 <li
//                                     key={location.id}
//                                     className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//                                     onClick={() => handleSelect(location)}
//                                 >
//                                     {location.name}
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : value && !isLoading ? (
//                         <div
//                             className="p-2 text-gray-600 cursor-pointer hover:bg-gray-100"
//                             onClick={() => handleCreateLocation(value)}
//                         >
//                             Press Enter to create location "{value}"
//                         </div>
//                     ) : (
//                         <div className="p-2 text-gray-500">
//                             {districtId
//                                 ? 'No locations found'
//                                 : 'Please select a district first'}
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     )
// }

// export default LocationAutosuggest


import React, { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import OutlinedInput from '@/components/ui/OutlinedInput'

interface Location {
    id: number
    name: string
    district_id: number
}

interface LocationAutosuggestProps {
    value: string
    locationId?: number
    onChange: (value: string, locationId?: number) => void
    districtId?: number | null
    label?: string
    placeholder?: string
}

const LocationAutosuggest: React.FC<LocationAutosuggestProps> = ({
    value,
    locationId,
    onChange,
    districtId,
    label = 'Location',
    placeholder = 'Enter Location',
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [locations, setLocations] = useState<Location[]>([])
    const [filteredLocations, setFilteredLocations] = useState<Location[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const inputWrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchLocations = async () => {
            if (!districtId) {
                setLocations([])
                return
            }

            setIsLoading(true)
            try {
                const response = await httpClient.get(
                    endpoints.common.location(),
                    {
                        params: { district_id: districtId },
                    },
                )
                setLocations(response.data)
            } catch (error) {
                console.error('Error fetching locations:', error)
                setLocations([])
            } finally {
                setIsLoading(false)
            }
        }

        if (districtId) {
            fetchLocations()
        }
    }, [districtId])

    useEffect(() => {
        const filtered = locations.filter((location) =>
            location.name.toLowerCase().includes(value.toLowerCase()),
        )
        setFilteredLocations(filtered)
    }, [value, locations])

    const handleCreateLocation = async (locationName: string) => {
        if (!districtId || isCreating) return

        setIsCreating(true)
        try {
            const response = await httpClient.post(
                endpoints.common.location(),
                {
                    name: locationName,
                    district_id: districtId,
                },
            )
            const newLocation = response.data
            setLocations((prev) => [...prev, newLocation])
            onChange(locationName, newLocation.id)
            setIsOpen(false)
        } catch (error) {
            console.error('Error creating location:', error)
        } finally {
            setIsCreating(false)
        }
    }

    const handleSelect = (location: Location) => {
        onChange(location.name, location.id)
        setIsOpen(false)
    }

    const handleInputChange = (inputValue: string) => {
        onChange(inputValue, undefined)
        setIsOpen(true)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleCreateLocation(value)
        }
    }

    return (
        <div className="relative" ref={wrapperRef}>
            <p className="mb-2">
                {label} <span className="text-red-500">*</span>
            </p>
            <div
                className="relative"
                ref={inputWrapperRef}
                onKeyDown={handleKeyDown}
                tabIndex={-1}
            >
                <OutlinedInput
                    value={value}
                    onChange={handleInputChange}
                    label={placeholder}
                    disabled={isCreating}
                />
                <button
                    onClick={() => districtId && setIsOpen(!isOpen)}
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
                    disabled={!districtId || isCreating}
                >
                    {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>
            </div>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    {isLoading ? (
                        <div className="p-2 text-gray-500 flex items-center justify-center">
                            <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                            Loading locations...
                        </div>
                    ) : filteredLocations.length > 0 ? (
                        <ul className="max-h-60 overflow-auto">
                            {filteredLocations.map((location) => (
                                <li
                                    key={location.id}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSelect(location)}
                                >
                                    {location.name}
                                </li>
                            ))}
                        </ul>
                    ) : value && !isLoading ? (
                        <div
                            className={`p-2 text-gray-600 ${
                                isCreating 
                                    ? 'cursor-wait bg-gray-50' 
                                    : 'cursor-pointer hover:bg-gray-100'
                            } flex items-center justify-center`}
                            onClick={() => !isCreating && handleCreateLocation(value)}
                        >
                            {isCreating ? (
                                <>
                                    <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                                    Creating location "{value}"...
                                </>
                            ) : (
                                <>Press Enter to create location "{value}"</>
                            )}
                        </div>
                    ) : (
                        <div className="p-2 text-gray-500">
                            {districtId
                                ? 'No locations found'
                                : 'Please select a district first'}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default LocationAutosuggest