"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, deleteAccount } from "./actions";
import { signOut } from "@/lib/auth-client";
import { Loader2, Camera, Trash2, ShieldAlert } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UserProfile {
  name: string;
  email: string;
  image: string | null;
  bio: string | null;
  phoneNumber: string | null;
  location: string | null;
  role: string;
}

export default function AccountSettingsClient({ user }: { user: UserProfile }) {
  const router = useRouter();
  
  // Profile state
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [location, setLocation] = useState(user.location || "");
  const [image, setImage] = useState(user.image || "");
  
  // Loading states
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("folder", "avatars");

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setImage(data.url);
    } catch (error) {
      console.error(error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const result = await updateProfile({
        name,
        bio,
        phoneNumber,
        location,
        image,
      });
      if (result.error) {
        alert(result.error);
      } else {
        alert("Profile updated successfully!");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAccount();
      if (result.error) {
        alert(result.error);
        setIsDeleting(false);
      } else {
        await signOut({
          fetchOptions: {
            onSuccess: () => {
              window.location.href = "/";
            }
          }
        });
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete account");
      setIsDeleting(false);
    }
  };

  return (
    <Tabs defaultValue="profile" className="space-y-4">
      <TabsList className="border-2 border-black bg-purple-50 p-1 flex flex-wrap justify-start max-w-full w-fit h-auto shadow-[4px_4px_0_0_#000]">
        <TabsTrigger 
          value="profile" 
          className="font-bold text-sm uppercase px-6 py-2 data-[state=active]:bg-lime-300 data-[state=active]:text-black data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:shadow-[2px_2px_0_0_#000]"
        >
          Profile
        </TabsTrigger>
        <TabsTrigger 
          value="account" 
          className="font-bold text-sm uppercase px-6 py-2 data-[state=active]:bg-pink-300 data-[state=active]:text-black data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:shadow-[2px_2px_0_0_#000]"
        >
          Account Info
        </TabsTrigger>
        <TabsTrigger 
          value="danger" 
          className="font-bold text-sm uppercase px-6 py-2 text-red-600 data-[state=active]:bg-red-500 data-[state=active]:text-white data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:shadow-[2px_2px_0_0_#000]"
        >
          Danger Zone
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-4">
        <Card className="border-4 border-black shadow-[8px_8px_0_0_#000]">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase tracking-tight">Public Profile</CardTitle>
            <CardDescription className="font-bold text-muted-foreground">
              This information will be displayed to other users on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer">
                <Avatar className="w-24 h-24 border-4 border-black shadow-[4px_4px_0_0_#000]">
                  <AvatarImage src={image} className="object-cover" />
                  <AvatarFallback className="bg-yellow-300 text-2xl font-black">
                    {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  {isUploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
                </div>
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg">Profile Picture</h3>
                <p className="text-sm font-medium text-muted-foreground">We recommend a 1:1 image that is at least 200x200px.</p>
                {image && (
                  <Button variant="ghost" size="sm" onClick={() => setImage("")} className="mt-2 text-red-500 font-bold hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="font-bold uppercase tracking-wide text-xs">Display Name</Label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="border-2 border-black focus-visible:ring-lime-300 font-medium max-w-md" 
                placeholder="Your full name" 
              />
            </div>
            
            <div className="grid gap-2">
              <Label className="font-bold uppercase tracking-wide text-xs">Bio</Label>
              <Textarea 
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                className="border-2 border-black focus-visible:ring-lime-300 font-medium min-h-[100px]" 
                placeholder="Tell us a bit about yourself..." 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label className="font-bold uppercase tracking-wide text-xs">Phone Number</Label>
                <Input 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  className="border-2 border-black focus-visible:ring-lime-300 font-medium" 
                  placeholder="(555) 123-4567" 
                />
              </div>
              <div className="grid gap-2">
                <Label className="font-bold uppercase tracking-wide text-xs">Location</Label>
                <Input 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  className="border-2 border-black focus-visible:ring-lime-300 font-medium" 
                  placeholder="e.g. North Campus Dorms" 
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50 border-t-4 border-black p-6">
            <Button 
              onClick={handleSaveProfile} 
              disabled={isSaving}
              className="font-black text-base border-2 border-black bg-lime-300 text-black hover:bg-lime-400 shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 transition-all w-full md:w-auto px-8"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isSaving ? "Saving changes..." : "Save changes"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="account" className="space-y-4">
        <Card className="border-4 border-black shadow-[8px_8px_0_0_#000]">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase tracking-tight">Account Details</CardTitle>
            <CardDescription className="font-bold text-muted-foreground">
              Your core account security details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label className="font-bold uppercase tracking-wide text-xs">Email Address</Label>
              <Input 
                value={user.email} 
                disabled 
                className="border-2 border-black bg-gray-100 font-medium cursor-not-allowed max-w-md" 
              />
              <p className="text-xs font-medium text-muted-foreground mt-1">
                Your email address cannot be changed right now.
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label className="font-bold uppercase tracking-wide text-xs">Account Role</Label>
              <div className="w-fit border-2 border-black bg-blue-100 px-4 py-2 font-black uppercase text-sm shadow-[2px_2px_0_0_#000]">
                {user.role}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="danger" className="space-y-4">
        <Card className="border-4 border-red-500 shadow-[8px_8px_0_0_#ef4444]">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase tracking-tight text-red-600 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6" />
              Danger Zone
            </CardTitle>
            <CardDescription className="font-bold text-red-500/80">
              Irreversible destructive actions for your account. Proceed with extreme caution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-red-200 bg-red-50 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-lg">Delete Account</h4>
                <p className="font-medium text-sm text-red-600/80 max-w-xl">
                  Once you delete your account, there is no going back. Please be certain. All your data, bookings, and messages will be permanently eliminated.
                </p>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="font-black border-2 border-red-700 shadow-[4px_4px_0_0_#b91c1c] hover:shadow-[6px_6px_0_0_#b91c1c] hover:-translate-y-0.5 transition-all whitespace-nowrap">
                    Delete my account
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-4 border-red-600 shadow-[8px_8px_0_0_#dc2626]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black uppercase text-red-600">Are you absolutely sure?</DialogTitle>
                    <DialogDescription className="font-bold text-base mt-2">
                      This action cannot be undone. This will permanently delete your account and remove your active data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-6 flex gap-2">
                    <DialogTrigger asChild>
                      <Button variant="outline" className="font-bold border-2 border-black hover:bg-gray-100">Cancel</Button>
                    </DialogTrigger>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="font-black"
                    >
                      {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                      {isDeleting ? "Deleting..." : "Yes, delete my account"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
