import { Patient } from '../../types/types';
import { calculateAge } from '../../lib/dateUtils';

interface PatientSummaryProps {
  patient: Patient | null;
}

export function PatientSummary({ patient }: PatientSummaryProps) {
  if (!patient) return null;

  const age = calculateAge(new Date(patient.dateOfBirth));
  const title = 'Mx.';

  const dummyData = {
    generalSummary: 
      `${title} ${patient.lastName}, ${age} years old, demonstrates excellent compliance with prescribed treatment regimens and maintains regular engagement with healthcare providers. Patient is under the care of ${patient.primaryPhysician || 'their primary physician'}. Overall health indicators show positive trends, particularly in chronic condition management. Patient reports improved energy levels and quality of life.`,
    
    diagnoses: 
      `Primary diagnosis of Type 2 Diabetes Mellitus (E11.9), currently well-controlled with HbA1c maintained within target range. Secondary conditions include Grade 1 Hypertension (I10) and early-stage Osteoarthritis in left knee (M17.12). Recent evaluations indicate stable progression of all conditions with effective management strategies in place.`,
    
    labResults: 
      `Latest results from February 20, 2025, show improved metabolic control for ${title} ${patient.lastName}. Cholesterol profile indicates Total: 180 mg/dL (optimal range), with favorable HDL/LDL ratio. Blood pressure consistently maintained at 120/80 mmHg, demonstrating effective response to current treatment. HbA1c level of 5.7% reflects excellent glycemic control.${patient.bloodType ? ` Blood type: ${patient.bloodType}.` : ''}`,
    
    treatments: 
      `Current treatment plan for ${title} ${patient.lastName} includes Metformin 1000mg BID for diabetes management, with consistent blood glucose monitoring showing desired results. Cardiovascular health managed with Lisinopril 10mg daily. Physical therapy program in progress since January 2025, focusing on knee strengthening with notable improvement in mobility and reduced discomfort.`
  };

  const sections = [
    { id: 'general', title: 'General Summary' },
    { id: 'diagnosis', title: 'Diagnosis' },
    { id: 'lab-results', title: 'Lab Results' },
    { id: 'treatments', title: 'Treatments' }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex gap-6">
      {/* Quick Navigation */}
      <div className="w-48 flex-shrink-0">
        <div className="bg-white shadow rounded-lg p-4 sticky top-4">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="w-full text-left px-2 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div id="patient-summary-content" className="bg-white shadow rounded-lg p-6 space-y-6 h-[calc(100vh-16rem)] overflow-y-auto scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">
          <section id="general" className="scroll-mt-6">
            <h2 className="text-sm font-medium uppercase tracking-wide text-gray-500 mb-2">General</h2>
            <div className="text-gray-800 text-sm leading-relaxed">
              {dummyData.generalSummary}
            </div>
          </section>

          <section id="diagnosis" className="scroll-mt-6">
            <h2 className="text-sm font-medium uppercase tracking-wide text-gray-500 mb-2">Diagnosis</h2>
            <div className="text-gray-800 text-sm leading-relaxed">
              <span className="text-blue-700 font-medium">Type 2 Diabetes Mellitus (E11.9)</span>
              {" - "}
              <span className="text-green-600">well-controlled</span>
              <br />
              <span className="text-blue-700 font-medium">Grade 1 Hypertension (I10)</span>
              {" - "}
              <span className="text-green-600">stable</span>
              <br />
              <span className="text-blue-700 font-medium">Osteoarthritis - Left Knee (M17.12)</span>
              {" - "}
              <span className="text-yellow-600">under monitoring</span>
              <br />
              <p className="mt-2">{dummyData.diagnoses}</p>
            </div>
          </section>

          <section id="lab-results" className="scroll-mt-6">
            <h2 className="text-sm font-medium uppercase tracking-wide text-gray-500 mb-2">Lab Results</h2>
            <div className="text-gray-800 text-sm leading-relaxed">
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Cholesterol:</span>{" "}
                  <span className="text-green-600 font-medium">180 mg/dL</span> (Total)
                </p>
                <p>
                  <span className="font-medium">Blood Pressure:</span>{" "}
                  <span className="text-green-600 font-medium">120/80 mmHg</span>
                </p>
                <p>
                  <span className="font-medium">HbA1c:</span>{" "}
                  <span className="text-green-600 font-medium">5.7%</span>
                </p>
                {patient.bloodType && (
                  <p>
                    <span className="font-medium">Blood Type:</span>{" "}
                    <span className="font-medium">{patient.bloodType}</span>
                  </p>
                )}
              </div>
              <p className="mt-3">{dummyData.labResults}</p>
            </div>
          </section>

          <section id="treatments" className="scroll-mt-6">
            <h2 className="text-sm font-medium uppercase tracking-wide text-gray-500 mb-2">Treatments</h2>
            <div className="text-gray-800 text-sm leading-relaxed">
              <div className="space-y-2">
                <p>
                  <span className="text-blue-700 font-medium">Diabetes Management:</span>
                  {" Metformin 1000mg BID"}
                </p>
                <p>
                  <span className="text-blue-700 font-medium">Cardiovascular:</span>
                  {" Lisinopril 10mg daily"}
                </p>
                <p>
                  <span className="text-blue-700 font-medium">Physical Therapy:</span>
                  {" Bi-weekly sessions"}
                </p>
              </div>
              <p className="mt-3">{dummyData.treatments}</p>
            </div>
          </section>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 italic">
              Note: This is a placeholder summary. Future versions will generate this content 
              from the patient's medical data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
