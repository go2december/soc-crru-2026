import { fetchProgramByCode } from '@/lib/api';
import ProgramTemplate, { ProgramData } from '@/components/ProgramTemplate';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{
        code: string;
    }>
}

export default async function ProgramDynamicsPage(props: Props) {
    const params = await props.params;
    const { code } = params;

    // Fetch data from API
    const program = await fetchProgramByCode(code);

    if (!program) {
        notFound();
    }

    // Map API data to UI Component Props
    const templateData: ProgramData = {
        id: program.id,
        title: program.nameTh,
        degree: program.degreeTitleTh || program.degreeTitleEn || program.nameTh,
        image: program.bannerUrl || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop",
        description: program.description || "",
        level: program.degreeLevel === "BACHELOR" ? "ปริญญาตรี" :
            program.degreeLevel === "MASTER" ? "ปริญญาโท" : "ปริญญาเอก",
        highlights: (program.highlights || []).map(h => ({
            title: h.title,
            description: h.description,
            // icon mapping could be added here if we had an icon library mapping
        })),
        careers: program.careers || [],
        structure: program.structure || {
            totalCredits: 0,
            general: 0,
            major: 0,
            freeElective: 0
        },
        downloadLink: program.curriculumUrl,
        concentrations: program.concentrations
    };

    return <ProgramTemplate data={templateData} />;
}
