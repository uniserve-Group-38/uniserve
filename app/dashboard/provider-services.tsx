"use client"

import { format } from "date-fns"
import type { Prisma } from "@/lib/generated/prisma/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
    Pencil, 
    Trash2, 
    Plus,
    Loader2
} from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

type Service = Prisma.ServiceGetPayload<{}>

interface ProviderServicesProps {
  services: Service[]
}

export function ProviderServices({ services }: ProviderServicesProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  
  // Form State
  const [formData, setFormData] = useState({
      title: "",
      description: "",
      price: "",
      category: ""
  })

  const resetForm = () => {
      setFormData({ title: "", description: "", price: "", category: "" })
      setEditingService(null)
  }

  const handleEdit = (service: Service) => {
      setEditingService(service)
      setFormData({
          title: service.title,
          description: service.description || "",
          price: service.price || "",
          category: service.category || ""
      })
      setIsDialogOpen(true)
  }

  const handleDelete = async (serviceId: string) => {
      if (!confirm("Are you sure you want to delete this service?")) return
      
      setIsLoading(serviceId)
      try {
          const res = await fetch(`/api/provider/services/${serviceId}`, { method: "DELETE" })
          if (res.ok) {
              toast.success("Service deleted successfully")
              router.refresh()
          } else {
              toast.error("Failed to delete service")
          }
      } catch (error) {
          toast.error("Something went wrong")
      } finally {
          setIsLoading(null)
      }
  }

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading("submitting")
      
      const method = editingService ? "PUT" : "POST"
      const url = editingService ? `/api/provider/services/${editingService.id}` : "/api/provider/services"
      
      try {
          const res = await fetch(url, {
              method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData)
          })
          
          if (res.ok) {
              toast.success(`Service ${editingService ? "updated" : "created"} successfully`)
              setIsDialogOpen(false)
              resetForm()
              router.refresh()
          } else {
              toast.error("Failed to save service")
          }
      } catch (error) {
          toast.error("Something went wrong")
      } finally {
          setIsLoading(null)
      }
  }

  if (!services.length && !isDialogOpen) {
    return (
      <section className="rounded-2xl border-4 border-dashed border-black bg-white/70 p-12 text-center shadow-[6px_6px_0_0_#000]">
        <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-purple-100 border-4 border-black flex items-center justify-center rotate-6">
                <Plus className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-black uppercase">Start Your Business</h2>
            <p className="max-w-xs font-bold text-foreground/70">
              You haven&apos;t created any services yet. Create your first listing to start receiving bookings!
            </p>
            <Button 
                onClick={() => { resetForm(); setIsDialogOpen(true); }}
                className="mt-4 neo-border bg-black text-white font-black uppercase shadow-[4px_4px_0_0_#000] hover:-translate-y-1 transition-all"
            >
                Create My First Service
            </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-3xl font-black uppercase italic text-black/90">Your Listings</h2>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
                <DialogTrigger asChild>
                    <Button className="neo-border bg-black text-white font-black uppercase shadow-[4px_4px_0_0_#000] hover:-translate-y-1 transition-all">
                        <Plus className="mr-2 h-5 w-5" /> Add New Service
                    </Button>
                </DialogTrigger>
                <DialogContent className="neo-border rounded-none border-4 border-black shadow-[8px_8px_0_0_#000]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase">
                            {editingService ? "Edit Service" : "Create New Service"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase tracking-wider">Service Title</label>
                            <Input 
                                required
                                value={formData.title} 
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                placeholder="e.g. Graphic Design Masterclass" 
                                className="neo-border font-bold"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase tracking-wider">Description</label>
                            <Textarea 
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Describe what you offer..." 
                                className="neo-border font-bold min-h-[100px]"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-wider">Price (GH₵)</label>
                                <Input 
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    placeholder="45" 
                                    className="neo-border font-bold"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-wider">Category</label>
                                <Input 
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    placeholder="Design" 
                                    className="neo-border font-bold"
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button 
                                type="submit" 
                                disabled={isLoading === "submitting"}
                                className="w-full neo-border bg-lime-300 text-black font-black uppercase shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all"
                            >
                                {isLoading === "submitting" ? <Loader2 className="animate-spin" /> : (editingService ? "Update Listing" : "Launch Service")}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
          </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <article
            key={service.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_#000] transition-transform hover:-translate-y-1"
          >
            <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(0,0,0,0.02)_0,rgba(0,0,0,0.02)_2px,transparent_2px,transparent_6px)]" />
            
            <div className="relative">
              <header className="flex items-start justify-between gap-2 mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-black uppercase tracking-tighter line-clamp-1 mb-2">
                    {service.title}
                  </h3>
                  <Badge className="neo-border bg-purple-100 text-black font-black uppercase text-[10px] tracking-widest">
                    {service.category || "General"}
                  </Badge>
                </div>
                <div className="flex gap-1">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEdit(service)}
                        className="h-8 w-8 neo-border bg-yellow-100 hover:bg-yellow-200"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        disabled={isLoading === service.id}
                        onClick={() => handleDelete(service.id)}
                        className="h-8 w-8 neo-border bg-red-100 hover:bg-red-200"
                    >
                        {isLoading === service.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                </div>
              </header>
              <p className="text-sm font-bold text-foreground/80 line-clamp-3 mb-6 bg-gray-50 p-3 neo-border-thin">
                {service.description}
              </p>
            </div>

            <div className="relative flex items-center justify-between mt-auto pt-4 border-t-2 border-black/10">
              <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase opacity-40">Price</span>
                  <span className="text-xl font-black text-lime-600">GH₵ {service.price || "0"}</span>
              </div>
              <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase opacity-40">Created</span>
                  <span className="text-xs font-bold">{format(new Date(service.createdAt), "dd MMM yyyy")}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
