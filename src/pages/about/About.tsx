export default function About() {
	return (
		<div className="flex items-center justify-center h-screen flex-col">
			<h1 className="text-3xl font-bold underline" data-test="about-msg">
				This is the about page!
			</h1>
			<p className="mt-2 text-gray-500">
				If this page is rendered, that means you have a valid access token
			</p>
		</div>
	);
}
