import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProjectInfoProps = {
	title: string;
	description: string;
	context: string;
	target_date: string;
	estimated_hours: number;
	success_criteria: string[];
};

const ProjectInfo = (props: ProjectInfoProps) => {
	return (
		<Card className="h-full w-full">
			<CardHeader>
				<CardTitle className="text-2xl">{props.title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div>
						<h3 className="mb-2 text-lg font-semibold">Description</h3>
						<p className="text-muted-foreground">{props.description}</p>
					</div>
					<div>
						<h3 className="mb-2 text-lg font-semibold">Context</h3>
						<p className="text-muted-foreground">{props.context}</p>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<h3 className="mb-2 text-lg font-semibold">Target Date</h3>
							<p className="text-muted-foreground">{props.target_date}</p>
						</div>
						<div>
							<h3 className="mb-2 text-lg font-semibold">Estimated Hours</h3>
							<p className="text-muted-foreground">{props.estimated_hours}</p>
						</div>
					</div>
					<div>
						<h3 className="mb-2 text-lg font-semibold">Success Criteria</h3>
						<ul className="text-muted-foreground list-inside list-disc">
							{props.success_criteria.map((criterion, index) => (
								<li key={criterion + index}>{criterion}</li>
							))}
						</ul>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default ProjectInfo;
