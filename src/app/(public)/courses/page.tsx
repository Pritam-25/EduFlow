import { Suspense } from "react";
import { getAllCourses } from "../actions/get-all-courses";
import PublicCourseCard, { PublicCourseCardSkeleton } from "../components/courseCard";

export default function Page() {
    return (
        <div >
            <div className="flex flex-col space-y-2 mb-10">
                <h1 className="text-3xl md:text-4xl tracking-tighter font-bold"> Explore Courses</h1>
                <p className="text-muted-foreground">Discover a variety of courses to enhance your skills and knowledge.</p>
            </div>

            <Suspense fallback={<LoadingSkeleton />}>
                <RenderCourses />
            </Suspense>
        </div>
    );
}


async function RenderCourses() {
    const courses = await getAllCourses();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-6">
            {courses.map((course) => (
                <PublicCourseCard key={course.id} course={course} />
            ))}
        </div>
    );
}


function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
                <PublicCourseCardSkeleton key={index} />
            ))}
        </div>
    );
}