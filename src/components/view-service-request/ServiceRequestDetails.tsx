import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import RejectServiceRequest from "./RejectServiceRequest";
import ApproveServiceRequest from "./ApproveServiceRequest";
import Link from "next/link";
import useGetUserRole from "@/hooks/useGetUserRole";

interface ServiceRequestDetailsProps {
  requestorName: string;
  title: string;
  details: string;
  createdOn: string;
}

export default function ServiceRequestDetails({
  requestorName,
  title,
  details,
  createdOn,
}: ServiceRequestDetailsProps) {
  const { userRole } = useGetUserRole();
  const formattedDate = new Date(createdOn).toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <Card className="w-full h-screen flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center mb-4">
          <Link href={"/service-request"}>
            <Button variant="ghost" size="icon">
              <ArrowLeftIcon id="back-button" className="h-4 w-4" />
            </Button>
          </Link>
          <h1 id="title-of-request" className="text-2xl font-semibold">
            {title}
          </h1>
          <div className="flex space-x-2">
          {userRole === "ADMIN" && (
            <div>
            <RejectServiceRequest />
            <ApproveServiceRequest />
            </div>
          )}
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="/placeholder.svg?height=32&width=32"
                alt={requestorName}
              />
              <AvatarFallback>
                {requestorName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span id="requestor-name" data-testid="requestor-name">
              {requestorName}
            </span>
            <span id="requestor-email">
              &lt;{requestorName.toLowerCase().replace(" ", ".")}
              @example.com&gt;
            </span>
          </div>
          <time id="created-on" dateTime={createdOn}>
            {formattedDate}
          </time>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6 flex-grow">
        <div id="request-details" className="prose max-w-none">
          <p>{details}</p>
        </div>
      </CardContent>
      <Separator className="my-4" />
      <div className="px-6 pb-4 flex justify-between">
        <Button variant="outline" size="sm">
          <ArrowLeftIcon
            id="previous-button"
            data-testid="arrow-left-icon"
            className="h-4 w-4 mr-2"
          />
          Previous
        </Button>
        <Button variant="outline" size="sm">
          Next
          <ArrowRightIcon
            id="next-button"
            data-testid="arrow-right-icon"
            className="h-4 w-4 ml-2"
          />
        </Button>
      </div>
    </Card>
  );
}
