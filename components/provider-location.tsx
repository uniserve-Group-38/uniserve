"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Navigation, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Leaflet CSS and JS will be loaded via CDN for simplicity in this environment
const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"

type BookingWithRelations = any // Simplify for now, or import Prisma type

export function ProviderLocation({ bookings = [] }: { bookings?: any[] }) {
    const mapRef = useRef<HTMLDivElement>(null)
    const [mapInstance, setMapInstance] = useState<any>(null)
    const [markers, setMarkers] = useState<any[]>([])
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [scriptsLoaded, setScriptsLoaded] = useState(false)

    // Load Leaflet scripts
    useEffect(() => {
        if (typeof window === "undefined") return

        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = LEAFLET_CSS
        document.head.appendChild(link)

        const script = document.createElement("script")
        script.src = LEAFLET_JS
        script.async = true
        script.onload = () => setScriptsLoaded(true)
        document.body.appendChild(script)

        return () => {
            document.head.removeChild(link)
            document.body.removeChild(script ?? document.createElement('script')) // Safety
        }
    }, [])

    const getColorForCoords = () => {
        if (coords) return "bg-green-300"
        if (error) return "bg-red-300"
        return "bg-yellow-300"
    }

    const getLocation = () => {
        setLoading(true)
        setError(null)

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser")
            setLoading(false)
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                setCoords({ lat: latitude, lng: longitude })
                setLoading(false)
            },
            (err) => {
                setError(err.message)
                setLoading(false)
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        )
    }

    // Auto-get location on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            getLocation()
        }
    }, [])

    // Helper to parse coordinates from string "lat, lng"
    const parseCoords = (locStr: string | null) => {
        if (!locStr) return null
        const parts = locStr.split(',')
        if (parts.length === 2) {
            const lat = parseFloat(parts[0])
            const lng = parseFloat(parts[1])
            if (!isNaN(lat) && !isNaN(lng)) return { lat, lng }
        }
        return null
    }

    // Initialize/Update Map
    useEffect(() => {
        if (!scriptsLoaded || !mapRef.current || !coords || typeof window === "undefined") return

        const L = (window as any).L
        if (!L) return

        let map = mapInstance
        if (!map) {
            map = L.map(mapRef.current).setView([coords.lat, coords.lng], 13)
            
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map)

            setMapInstance(map)
        }

        // Clear existing markers
        markers.forEach(m => m.remove())
        const newMarkers: any[] = []

        // Provider Marker
        const providerMarker = L.marker([coords.lat, coords.lng], {
            icon: L.divIcon({
                className: 'custom-div-icon',
                html: "<div style='background-color:#bef264; width:12px; height:12px; border:2px solid black; border-radius:50%;'></div>",
                iconSize: [12, 12],
                iconAnchor: [6, 6]
            })
        }).addTo(map)
        providerMarker.bindPopup("<b>You are here</b>")
        newMarkers.push(providerMarker)

        // Student Markers
        bookings.forEach(booking => {
            const studentLoc = parseCoords(booking.student.location)
            if (studentLoc) {
                const marker = L.marker([studentLoc.lat, studentLoc.lng]).addTo(map)
                marker.bindPopup(`
                    <div style="font-family: inherit;">
                        <b style="text-transform: uppercase;">${booking.student.name}</b><br/>
                        <span style="font-size: 10px; font-weight: bold;">${booking.service.title}</span>
                    </div>
                `)
                marker.bookingId = booking.id
                newMarkers.push(marker)
            }
        })

        setMarkers(newMarkers)

        // Focus event listener
        const handleFocus = (e: any) => {
            const bookingId = e.detail
            const targetMarker = newMarkers.find(m => m.bookingId === bookingId)
            if (targetMarker) {
                map.setView(targetMarker.getLatLng(), 16)
                targetMarker.openPopup()
                mapRef.current?.scrollIntoView({ behavior: 'smooth' })
            }
        }

        window.addEventListener('focus-booking', handleFocus)
        return () => window.removeEventListener('focus-booking', handleFocus)

    }, [scriptsLoaded, coords, mapInstance, bookings])

    return (
        <section id="map" className="mt-8 space-y-4 scroll-mt-20">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold uppercase tracking-tight text-foreground">
                    Live Booking Map
                </h2>
                <div className="flex gap-2">
                    <Badge variant="outline" className="border-2 border-black bg-white font-black uppercase text-xs">
                        {bookings.length} Pending Bookings
                    </Badge>
                    <Badge variant="outline" className={`${getColorForCoords()} border-2 border-black font-black uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                        {coords ? "Active" : error ? "Error" : "Tracking..."}
                    </Badge>
                </div>
            </div>

            <div className="relative overflow-hidden neo-border bg-white neo-shadow-lg min-h-[450px] flex flex-col">
                <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.02)_0,rgba(0,0,0,0.02)_2px,transparent_2px,transparent_6px)] z-10" />
                
                {!coords && !error && !loading && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-20">
                        <div className="w-20 h-20 bg-purple-100 border-4 border-black rounded-full flex items-center justify-center mb-6 animate-bounce">
                            <MapPin className="h-10 w-10 text-black" />
                        </div>
                        <h3 className="text-xl font-black uppercase mb-2">Enable Live Tracking</h3>
                        <p className="max-w-md font-bold text-muted-foreground mb-6">
                            Show your location relative to your students to optimize your service route.
                        </p>
                        <Button 
                            onClick={getLocation}
                            className="neo-border bg-lime-300 text-black font-black uppercase px-8 py-6 h-auto text-lg hover:bg-lime-400 transition-colors neo-shadow-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                        >
                            <Navigation className="mr-2 h-5 w-5" />
                            Start Tracking
                        </Button>
                    </div>
                )}

                {loading && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-20 bg-white/80">
                        <RefreshCw className="h-12 w-12 text-black animate-spin mb-4" />
                        <p className="font-black uppercase tracking-widest text-lg">Locating Signal...</p>
                    </div>
                )}

                {error && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-20 bg-red-50">
                        <div className="w-16 h-16 bg-red-200 border-4 border-black flex items-center justify-center mb-4">
                            <span className="text-3xl font-black">!</span>
                        </div>
                        <h3 className="text-lg font-black uppercase mb-1 text-red-600">Map Error</h3>
                        <p className="font-bold text-muted-foreground mb-6">{error}</p>
                        <Button 
                            onClick={getLocation}
                            variant="outline"
                            className="neo-border bg-white text-black font-black uppercase hover:bg-amber-100 transition-colors"
                        >
                            Retry Connection
                        </Button>
                    </div>
                )}

                <div 
                    ref={mapRef} 
                    className={`flex-1 w-full h-[450px] z-0 transition-opacity duration-700 ${coords ? 'opacity-100' : 'opacity-0 h-0'}`}
                />

                {coords && (
                    <div className="bg-black text-white p-3 flex justify-between items-center text-[10px] font-black uppercase tracking-widest relative z-20">
                        <div className="flex gap-6">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-lime-300 border border-white"></div> Your Hub</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 border border-white"></div> Student Site</span>
                        </div>
                        <div className="flex gap-4 opacity-70">
                            <span>{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

