'use client';

import axios from 'axios';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { Project } from '@/models/project';
import ProjectTable from '@/components/ProjectTable/ProjectTable';
import Modal from '@/components/Modal/Modal';
import ProjectForm from '@/components/ProjectForm/ProjectForm';
import slugify from 'slugify';
import { toast } from 'react-hot-toast';

export default function Home() {
  interface FormData {
    name: string;
    description: string;
    id?: string;
  }

  const [projects, setProjects] = useState<null | Project[]>(null);
  const [showForm, setShowForm] = useState(false);
  const [isCreateProject, setIsCreateProject] = useState(false);
  const [isEditProject, setisEditProject] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    description: '',
    name: '',
  });

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await axios.get('/api/projects');

      setProjects(data);
    };

    fetchProjects();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEditProject) {
      return handleUpdate();
    }

    setIsCreateProject(true);

    const slug = slugify(formData.name);

    try {
      const { statusText } = await axios.post('/api/projects', {
        description: formData.description,
        name: formData.name,
        slug,
      });

      toast.success(statusText);
    } catch (error: any) {
      toast.error(error.response.data);
    } finally {
      setFormData({ description: '', name: '' });
      setShowForm(false);
      setIsCreateProject(false);
    }
  };

  const handleUpdate = async () => {
    const slug = slugify(formData.name);

    try {
      const { statusText } = await axios.patch('/api/projects', {
        id: formData.id,
        description: formData.description,
        name: formData.name,
        slug,
      });

      toast.success(statusText);
    } catch (error: any) {
      toast.error(error.response.data);
    } finally {
      setShowForm(false);
    }
  };

  const toggleProjectForm = () => setShowForm(prevState => !prevState);

  return (
    <>
      <Modal isVisible={showForm} />
      <ProjectForm
        formData={formData}
        isVisible={showForm}
        toggleProjectForm={toggleProjectForm}
        handleSubmit={handleSubmit}
        isCreateProject={isCreateProject}
        onChange={handleInputChange}
        isEditProject={isEditProject}
      />
      <button
        onClick={() => {
          setFormData({ description: '', name: '' });
          toggleProjectForm();
        }}
        className='relative outline-none inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 hover:text-white focus:ring-blue-300'
      >
        <span className='relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0'>
          Create Project
        </span>
      </button>
      {projects && (
        <ProjectTable
          projects={projects}
          setisEditProject={setisEditProject}
          setFormData={setFormData}
          setShowForm={setShowForm}
        />
      )}
    </>
  );
}
