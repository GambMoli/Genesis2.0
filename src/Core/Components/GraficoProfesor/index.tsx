
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';




  {/*const ApiData= async (libro_id:number) =>{
    const response  = await getStadisticsReservation(libro_id);
    console.log(response);


  }*/ }
const data = [
  { name: 'Enero', ventas: 4000, comisiones: 2400 },
  { name: 'Febrero', ventas: 3000, comisiones: 2210 },
  { name: 'Marzo', ventas: 2000, comisiones: 2290 },
  { name: 'Abril', ventas: 2780, comisiones: 2000 },
  { name: 'Mayo', ventas: 1890, comisiones: 2181 },
  { name: 'Junio', ventas: 2390, comisiones: 2500 },
  { name: 'Julio', ventas: 3490, comisiones: 2100 },
];

export const Dashboard = () => (
  <div style={{ width:"80%" , margin:"0 auto" , backgroundColor:"white" , padding:"30px 0 0 0 ", marginTop:"30px"}}>
      <ResponsiveContainer width="98%" height={400}>
    <LineChart data={data }>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="ventas" stroke="#8884d8" />
      <Line type="monotone" dataKey="comisiones" stroke="#82ca9d" />
    </LineChart>
  </ResponsiveContainer>
  </div>

);


