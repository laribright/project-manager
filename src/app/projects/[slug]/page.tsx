'use client';

import axios from 'axios';
import { useParams } from 'next/navigation';
import {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  useEffect,
  useState,
} from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from 'react-beautiful-dnd';

import { Project } from '@/models/project';
import AddBoardForm from '@/components/AddBoardForm/AddBoardForm';
import Modal from '@/components/Modal/Modal';
import slugify from 'slugify';
import { toast } from 'react-hot-toast';
import ProjectBoard from '@/components/ProjectBoard/ProjectBoard';
import AddFeatureForm from '@/components/AddFeatureForm/AddFeatureForm';
import FeatureCard from '@/components/FeatureCard/FeatureCard';

const ProjectItem = () => {
  const [project, setProject] = useState<null | Project>(null);
  const [isAddBoardFormVisible, setIsAddBoardFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddFeatureFormVisible, setIsAddFeatureFormVisible] = useState(false);
  const [boardData, setBoardData] = useState({ status: '' });
  const [selectedBoardId, setSelectedBoardId] = useState('');
  const [featureFormData, setFeatureFormData] = useState({
    name: '',
    description: '',
    finishDate: '',
  });

  const { slug } = useParams();

  useEffect(() => {
    const fetchProject = async () => {
      const { data } = await axios.get(`/api/projects/${slug}`);
      setProject(data);
    };

    fetchProject();
  }, [slug]);

  if (!project) return <></>;

  const toggleAddBoardForm = () =>
    setIsAddBoardFormVisible(prevState => !prevState);

  const updateBoardHandler: ChangeEventHandler<HTMLInputElement> = event => {
    const { name, value } = event.target;

    setBoardData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBoardSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const slug = slugify(boardData.status);

    try {
      const { statusText } = await axios.post('/api/project-board', {
        status: boardData.status,
        projectId: project.id,
        slug,
      });

      toast.success(statusText);
    } catch (error: any) {
      toast.error(error.response.data);
    } finally {
      setBoardData({ status: '' });
      setIsSubmitting(false);
      setIsAddBoardFormVisible(false);
    }
  };

  const handleFeatureChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFeatureFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFeatureSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const slug = slugify(featureFormData.name.toLowerCase());

    try {
      const { statusText } = await axios.post('/api/features', {
        ...featureFormData,
        slug,
        projectBoardId: selectedBoardId,
      });

      toast.success(statusText);
    } catch (error: any) {
      toast.error(error.response.data);
    } finally {
      setFeatureFormData({ description: '', finishDate: '', name: '' });
      setIsAddFeatureFormVisible(false);
    }
  };

  const toggleAddFeatureForm = () =>
    setIsAddFeatureFormVisible(prevState => !prevState);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === 'status') {
      const movedBoard = project.projectBoards[source.index];
      const updatedProjectBoards = Array.from(project.projectBoards);

      updatedProjectBoards.splice(source.index, 1);
      updatedProjectBoards.splice(destination.index, 0, movedBoard);

      setProject({
        ...project,
        projectBoards: updatedProjectBoards.map((board, idx: number) => ({
          ...board,
          order: idx + 1,
        })),
      });

      try {
        const { statusText } = await axios.patch('/api/project-board', {
          projectId: project.id,
          sourceIndex: source.index,
          destinationIndex: destination.index,
          type,
        });

        toast.success(statusText);
      } catch (error) {
        setProject({
          ...project,
          projectBoards: project.projectBoards,
        });
        toast.error('Update not successful');
      }
    } else if (type === 'feature') {
      const { index: sourceIndex, droppableId: sourceBoardId } = source;
      const destinationBoardId = destination.droppableId;

      const updatedProjectBoards = project.projectBoards.map(board => {
        if (board.id === sourceBoardId) {
          const movedFeature = board.features.splice(sourceIndex, 1)[0];

          const destinationBoard = project.projectBoards.find(
            board => board.id === destinationBoardId
          );

          // if (!destinationBoard) return;

          destinationBoard!.features.splice(destination.index, 0, movedFeature);

          return board;
        } else if (board.id === destinationBoardId) {
          return board;
        } else {
          return board;
        }
      });

      const updatedProject = {
        ...project,
        projectBoards: updatedProjectBoards,
      };

      setProject(updatedProject);

      try {
        const { statusText } = await axios.patch('/api/project-board', {
          type: 'feature',
          projectId: project.id,
          sourceIndex,
          destinationIndex: destination.index,
          sourceBoardId,
          destinationBoardId,
        });

        toast.success(statusText);
      } catch (error) {
        toast.error('update not successful');
      }
    }
  };

  return (
    <>
      <Modal isVisible={isAddBoardFormVisible || isAddFeatureFormVisible} />

      <AddFeatureForm
        featureFormData={featureFormData}
        handleFeatureChange={handleFeatureChange}
        handleFeatureSubmit={handleFeatureSubmit}
        isVisible={isAddFeatureFormVisible}
        toggleAddFeatureForm={toggleAddFeatureForm}
      />

      <AddBoardForm
        isVisible={isAddBoardFormVisible}
        toggleAddBoardForm={toggleAddBoardForm}
        boardData={boardData}
        handleBoardSubmit={handleBoardSubmit}
        isSubmitting={isSubmitting}
        updateBoardHandler={updateBoardHandler}
      />

      <div className='mb-6'>
        <h4 className='text-2xl font-bold'>{project.name}</h4>
        <p className='text-base text-gray-600'>{project.description}</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId='board-items'
          direction='horizontal'
          type='status'
        >
          {provided => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className='flex gap-6 items-start'
            >
              {project.projectBoards
                .sort((a: any, b: any) => a.order - b.order)
                .map((projectBoard, idx) => (
                  <Draggable
                    key={projectBoard.id}
                    draggableId={projectBoard.id}
                    index={idx}
                  >
                    {provided => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className='bg-[#f5f5f5] flex-shrink-0 w-[354px] rounded-2xl py-3 px-6'
                      >
                        <ProjectBoard
                          boardHeading={projectBoard.status}
                          boardId={projectBoard.id}
                          numFeatures={projectBoard.features.length}
                          setSelectedBoardId={setSelectedBoardId}
                          toggleAddFeature={toggleAddFeatureForm}
                        />

                        <Droppable droppableId={projectBoard.id} type='feature'>
                          {provided => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {projectBoard.features.map((feature, idx) => (
                                <Draggable
                                  key={feature.id}
                                  draggableId={feature.id}
                                  index={idx}
                                >
                                  {provided => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.dragHandleProps}
                                      {...provided.draggableProps}
                                    >
                                      <FeatureCard feature={feature} />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                ))}

              <div
                onClick={toggleAddBoardForm}
                className='grid place-content-center hover:bg-[#f5f5f5] cursor-pointer rounded-2xl border-4 border-dotted flex-none w-[354px] h-20 py-7'
              >
                <AiFillPlusCircle className='text-6xl' />
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default ProjectItem;
