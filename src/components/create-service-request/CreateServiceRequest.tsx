"use client"

import { useState } from "react"
import { ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

export default function CreateServiceRequest() {
  const [title, setTitle] = useState("")
  const [details, setDetails] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() === "" || details.trim() === "") {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }
    toast({
      title: "Success",
      description: "Your service request has been sent!",
    })
    setTitle("")
    setDetails("")
  }

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg border-2 border-gray-300 shadow-xl overflow-hidden h-auto m-auto">
      <div className="p-5 bg-primary text-primary-foreground flex items-center">
        <Button variant="ghost" size="icon" className="mr-2"
          onClick={() => router.push("/service-request")}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">Create Service Request</h1>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6 flex flex-col">
        <div className="space-y-2 flex-shrink-0">
          <label htmlFor="title" className="text-sm font-medium text-gray-700">
            Title of Service Request
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the title of your service request"
            className="w-full"
          />
        </div>
        <div className="space-y-2 flex-grow">
          <label htmlFor="details" className="text-sm font-medium text-gray-700">
            Details
          </label>
          <Textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Type your message here"
            className="w-full h-full max-h-[300px] min-h-[150px] resize-none overflow-auto"
          />
        </div>
        <div className="flex justify-end flex-shrink-0">
          <Button type="submit" className="w-full sm:w-auto">
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>
      </form>
    </div>
  )
}