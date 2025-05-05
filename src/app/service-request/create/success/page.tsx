import Link from "next/link"
import { CheckCircle, ArrowRight, ListChecks } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-blue-800">Request Submitted!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">
            Your service request has been successfully submitted. Our team will review it and get back to you soon.
          </p>
          {/* <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-blue-800 mb-1">Request ID</h3>
            <p className="text-blue-600 font-mono">#SR-{Math.floor(100000 + Math.random() * 900000)}</p>
          </div> */}
          <p className="text-sm text-gray-500">
            You will receive an email confirmation with the details of your request.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Link href="/service-request" className="w-full">
            <Button className="w-full bg-blue-600 hover:bg-blue-700" variant="default">
              <ListChecks className="h-4 w-4 mr-2" />
              View My Requests
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
              Return to Home
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
