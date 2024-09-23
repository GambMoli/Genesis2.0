
import './FooterStyle.css'
import { Typography } from 'antd';
const { Paragraph } = Typography;
export const Footer = () => {
    return (
        <div className='ContainerPrincipal'>
          <div>
          <Paragraph className='Descripcion'>Universidad de Santander - Sistemas de información </Paragraph>
          </div>
          <div>
          <Paragraph className='Descripcion'>Todos los derechos reservados © 2016 </Paragraph>
          </div>
          <div>
          <Paragraph className='Descripcion'>Institución de Educación Superior sujeta a la inspección y vigilancia del Ministerio de Educación Nacional </Paragraph>
          </div>  
        </div>
    );
  };
  