
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserCheck, Calendar, Clock, PlusCircle } from "lucide-react";

export default function ReceptionLaunchpad() {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Front Desk</h1>
                <p className="text-muted-foreground mt-2">Welcome. Select an action to begin.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

                {/* ACTION 1: CHECK IN / NEW PATIENT */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PlusCircle className="h-5 w-5 text-blue-500" />
                            New Patient
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500 mb-4">Register a new patient and start visit.</p>
                        <Link href="/hms/patients?action=new">
                            <Button className="w-full" variant="default">Register Patient</Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* ACTION 2: DASHBOARD / APPOINTMENTS */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-green-500" />
                            Appointments
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500 mb-4">View today's schedule and check-ins.</p>
                        <Link href="/hms/appointments">
                            <Button className="w-full" variant="outline">View Calendar</Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* ACTION 3: RECEPTION DASHBOARD (Metrics) */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserCheck className="h-5 w-5 text-purple-500" />
                            Dashboard
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500 mb-4">Overview of waiting room and stats.</p>
                        <Link href="/hms/reception/dashboard">
                            <Button className="w-full" variant="outline">Open Dashboard</Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* ACTION 4: ATTENDANCE */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-orange-500" />
                            Attendance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500 mb-4">Log your shift and view history.</p>
                        <Link href="/hms/attendance">
                            <Button className="w-full" variant="outline">My Attendance</Button>
                        </Link>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
