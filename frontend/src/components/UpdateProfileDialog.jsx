import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2, Upload } from 'lucide-react'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

import { USER_API_END_POINT } from '../utils/constant'
import { setUser } from '../redux/authSlice'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false)
    const { user } = useSelector((store) => store.auth)
    const dispatch = useDispatch()

    const [input, setInput] = useState({
        fullname: user?.fullname || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        bio: user?.profile?.bio || '',
        address: user?.profile?.address || '',
        flatNumber: user?.profile?.flatNumber || '',
        skills: user?.profile?.skills?.join(', ') || '',
        file: null
    })

    const changeEventHandler = (e) => {
        const { name, value } = e.target
        if (name === "skills") {
            setInput({
                ...input,
                [name]: value,
            })
        } else {
            setInput({ ...input, [name]: value })
        }
    }



    const submitHandler = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("fullname", input.fullname)
        formData.append("email", input.email)
        formData.append("phoneNumber", input.phoneNumber)
        formData.append("bio", input.bio)
        formData.append("address", input.address)
        formData.append("flatNumber", input.flatNumber)
        formData.append("skills", input.skills)
        if (input.file) {
            formData.append("file", input.file)
        }

        try {
            setLoading(true)
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            })
            
            if (res.data.success) {
                dispatch(setUser(res.data.user))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || "An error occurred")
        } finally {
            setLoading(false)
        }
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center text-gray-900">Update Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitHandler} className="space-y-3">
                    <div className="space-y-2">
                        <Label htmlFor="fullname" className="text-gray-700">Name</Label>
                        <Input
                            id="fullname"
                            name="fullname"
                            value={input.fullname}
                            onChange={changeEventHandler}
                            className="border-gray-300 focus:border-gray-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={input.email}
                            onChange={changeEventHandler}
                            className="border-gray-300 focus:border-gray-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className="text-gray-700">Phone Number</Label>
                        <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            value={input.phoneNumber}
                            onChange={changeEventHandler}
                            className="border-gray-300 focus:border-gray-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio" className="text-gray-700">Bio</Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            value={input.bio}
                            onChange={changeEventHandler}
                            className="border-gray-300 focus:border-gray-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="address" className="text-gray-700">Address</Label>
                            <Input
                                id="address"
                                name="address"
                                value={input.address}
                                onChange={changeEventHandler}
                                className="border-gray-300 focus:border-gray-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="flatNumber" className="text-gray-700">Flat Number</Label>
                            <Input
                                id="flatNumber"
                                name="flatNumber"
                                value={input.flatNumber}
                                onChange={changeEventHandler}
                                className="border-gray-300 focus:border-gray-500"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="skills" className="text-gray-700">Skills (comma-separated)</Label>
                        <Input
                            id="skills"
                            name="skills"
                            value={input.skills}
                            onChange={changeEventHandler}
                            className="border-gray-300 focus:border-gray-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="file" className="text-gray-700">Profile Photo</Label>
                        <input
                            id="file"
                            name="file"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setInput({...input, file: e.target.files?.[0] || null})}
                            className="w-full p-2 border border-border rounded-md"
                        />
                    </div>

                    <DialogFooter>
                        <Button 
                            type="submit" 
                            className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : 'Update Profile'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateProfileDialog

