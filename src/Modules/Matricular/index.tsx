import React, { useState, useEffect } from 'react';
import { Card, Typography, Input, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import "./MatricularStyle.css";

const { Title, Text } = Typography;
const { Search } = Input;

interface Course {
  id: string;
  name: string;
  credits: number;
  semester: number;
  schedule: string;
  date: string;
}

interface EnrollmentSummary {
  semester: number;
  enrollmentType: string;
  semesterCredits: number;
  enrolledCredits: number;
  availableCredits: number;
  itCourses: string;
  languageCourses: string;
}

export const Matricular: React.FC = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const enrollmentSummary: EnrollmentSummary = {
    semester: 5,
    enrollmentType: 'Completa',
    semesterCredits: 16,
    enrolledCredits: 16,
    availableCredits: 0,
    itCourses: '1 / 1',
    languageCourses: '1 / 1'
  };

  useEffect(() => {
    // Mock initial data
    const initialEnrolledCourses: Course[] = [
      {
        id: '06008-P',
        name: 'SEMINARIO DE INVESTIGACION II',
        credits: 2,
        semester: 5,
        schedule: 'Viernes, 07:40am a 09:20am',
        date: '2024-08-05 a 2024-11-24'
      },
      {
        id: '13672-A',
        name: 'GESTION INTEGRAL DE ALCANCE - TIEMPO Y COSTO DE PROYECTOS INFORMATICOS',
        credits: 3,
        semester: 6,
        schedule: 'Miércoles, 05:40pm a 07:05pm',
        date: '2024-08-05 a 2024-11-24'
      }
    ];

    const initialAvailableCourses: Course[] = [
      {
        id: '26499-P1',
        name: 'ARQUITECTURA DE COMPUTADORES',
        credits: 3,
        semester: 5,
        schedule: 'Viernes, 06:00am a 07:40am',
        date: '2024-08-05 a 2024-11-24'
      },
      {
        id: '13701-P',
        name: 'PROGRAMACION WEB',
        credits: 3,
        semester: 7,
        schedule: 'Miércoles, 07:05pm a 09:20pm',
        date: '2024-08-05 a 2024-11-24'
      }
    ];

    setEnrolledCourses(initialEnrolledCourses);
    setAvailableCourses(initialAvailableCourses);
  }, []);

  const handleEnroll = (course: Course) => {
    setEnrolledCourses([...enrolledCourses, course]);
    setAvailableCourses(availableCourses.filter(c => c.id !== course.id));
    message.success(`Matriculado en ${course.name}`);
  };



  const filteredAvailableCourses = availableCourses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCourseCard = (course: Course, isEnrolled: boolean) => (
    <Card 
      key={course.id} 
      className="course-card"
      actions={!isEnrolled ? [
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => handleEnroll(course)}
        >
          Matricular
        </Button>
      ] : []}
    >
      <Title level={5}>
        {course.id} - {course.name}
      </Title>
      <div className="course-info">
        <div>
          <Text strong>Créditos:</Text> <Text>{course.credits}</Text>
        </div>
        <div>
          <Text strong>Semestre:</Text> <Text>{course.semester}</Text>
        </div>
      </div>
      <div>
        <Text strong>Horario:</Text> <Text>{course.schedule}</Text>
      </div>
      <div>
        <Text strong>Fecha:</Text> <Text>{course.date}</Text>
      </div>
    </Card>
  );

  return (
    <div className="main-container-matricular">
      <div className="enrollment-header">
          <Title level={2}>Matrícula académica</Title>
          
        
        <table className="enrollment-summary">
          <thead>
            <tr>
              <th>Sem</th>
              <th>Tipo matrícula</th>
              <th>Cred. semestre</th>
              <th>Cred. Matriculados</th>
              <th>Cred. Disponibles</th>
              <th>Cursos Informática</th>
              <th>Cursos Idiomas</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{enrollmentSummary.semester}</td>
              <td>{enrollmentSummary.enrollmentType}</td>
              <td>{enrollmentSummary.semesterCredits}</td>
              <td>{enrollmentSummary.enrolledCredits}</td>
              <td>{enrollmentSummary.availableCredits}</td>
              <td>{enrollmentSummary.itCourses}</td>
              <td>{enrollmentSummary.languageCourses}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="courses-container">
        {/* Enrolled Courses Section */}
        <Card title={<span style={{ marginLeft: '3%' }}>Materias Matriculadas</span>}>
          <div>
            {enrolledCourses.map(course => renderCourseCard(course, true))}
            {enrolledCourses.length === 0 && (
              <Text className="text-gray-500">No hay materias matriculadas</Text>
            )}
          </div>
        </Card>

        {/* Available Courses Section */}
        <Card
          title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '3%' }}>
          <span>Plan de Estudio</span>
            <div style={{ flexShrink: 0 }}>
              <Search 
                placeholder="Filtrar por código o nombre"
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: 300 }}
              />
            </div>
          </div>
        }
      >
        <div>
          {filteredAvailableCourses.map(course => renderCourseCard(course, false))}
          {filteredAvailableCourses.length === 0 && (
            <Text className="text-gray-500">
              No hay materias disponibles {searchTerm && 'con los criterios de búsqueda'}
            </Text>
          )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Matricular;