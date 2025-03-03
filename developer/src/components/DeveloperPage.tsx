import React from 'react';
import { Link } from 'react-router-dom';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
    </div>
  );
};

interface ComponentLinkProps {
  title: string;
  description: string;
  path: string;
  docUrl?: string;
  icon?: React.ReactNode;
}

const ComponentLink: React.FC<ComponentLinkProps> = ({ title, description, path, docUrl, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        {icon && <div className="mb-3 text-blue-500">{icon}</div>}
        <Link to={path} className="block">
          <h3 className="text-lg font-medium text-blue-600 hover:text-blue-800 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </Link>
      </div>
      {docUrl && (
        <div className="px-5 py-3 bg-gray-50">
          <a 
            href={docUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-blue-500 hover:text-blue-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View Documentation
          </a>
        </div>
      )}
    </div>
  );
};

export const DeveloperPage: React.FC = () => {
  // GitHub repository URL - update with actual URL when available
  const githubRepoUrl = "https://github.com/petrarca/healthrecords-playground";
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Developer Resources</h1>
        <p className="text-gray-600">
          Welcome to the developer resources page. Here you'll find documentation, examples, and tools to help you build with our components.
        </p>
        <div className="mt-2">
          <a 
            href={`${githubRepoUrl}/blob/main/README.md`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View project documentation
          </a>
        </div>
      </div>

      <Section title="UI Components">
        <ComponentLink
          title="Quantity Input"
          description="A specialized input component for handling numeric quantities with units."
          path="/demo/quantity-input"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          }
        />
        <ComponentLink
          title="JSON Renderer"
          description="A component for displaying JSON data with collapsible sections and syntax highlighting."
          path="/demo/json-renderer"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          }
        />
        <ComponentLink
          title="Field Renderers"
          description="A collection of components for rendering different types of form fields and data."
          path="/demo/field-renderers"
          docUrl={`${githubRepoUrl}/blob/main/src/components/ui/fieldRenderers/README.md`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
          }
        />
      </Section>

      <Section title="Application Components">
        <ComponentLink
          title="Address Card"
          description="A component for managing patient addresses with support for adding, editing, and setting primary addresses."
          path="/demo/address-card"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }
        />
      </Section>

      {/* Additional sections can be added here in the future */}
      
      <div className="mt-12 pt-4 border-t text-sm text-gray-500">
        <p>
          For more information, please refer to the <a href={`${githubRepoUrl}/blob/main/README.md`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">project documentation</a> or contact the development team.
        </p>
      </div>
    </div>
  );
};
