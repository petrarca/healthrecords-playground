import React from 'react';
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom';
import { DeveloperPage } from '@components/DeveloperPage';
import { JsonRendererDemo } from '@components/demo/JsonRendererDemo';
import { AddressCardDemo } from '@components/demo/AddressCardDemo';
import { FieldRenderersDemo } from '@components/demo/FieldRenderersDemo';
import { QuantityInputDemo } from '@components/demo/QuantityInputDemo';

// Main App component
const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<DeveloperPage />} />
        <Route path="/demo/json-renderer" element={<JsonRendererDemo />} />
        <Route path="/demo/address-card" element={<AddressCardDemo />} />
        <Route path="/demo/field-renderers" element={<FieldRenderersDemo />} />
        <Route path="/demo/quantity-input" element={<QuantityInputDemo />} />
        <Route path="*" element={<DeveloperPage />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
