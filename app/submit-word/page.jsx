import CustomFooter from '@/components/customFooter'
import CustomNavbar from '@/components/navBar'
import SubmitWordForm from '@/components/submitWordForm'


export default async function page(){
  return (
    <div>
        <CustomNavbar/>
        <main className="container mx-auto px-6 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                </div>
                <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
                    <SubmitWordForm/>
                </div>
                <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <i data-feather="info" className="h-5 w-5 text-blue-400"></i>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">Submission Guidelines</h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Please ensure the word is genuinely used in Nigerian contexts</li>
                                    <li>Provide accurate meanings and examples</li>
                                    <li>All submissions will be reviewed before publishing</li>
                                    <li>By submitting, you agree to our <a href="/terms "
                                            className="text-blue-600 hover:underline">Terms of Use</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <CustomFooter/>
        <script>
            {/* 
{            // Form submission handling
}            document.getElementById('wordForm').addEventListener('submit', function (e) {
                e.preventDefault();
                if (validateForm(this)) {
                    // In a real app, you would submit to a backend API
                    alert('Thank you for your contribution! Your word has been submitted for review.');
                    this.reset();
                }
            });

{            // Record button functionality
}            document.getElementById('recordBtn').addEventListener('click', function () {
                alert('Recording functionality would be implemented here in a production app');
            });

            feather.replace();*/}
        </script>
    </div>
  )
}

