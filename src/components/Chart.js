import React, { useContext, useEffect, useState } from 'react'

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, } from 'recharts';
import { CryptoContext } from '../context/CryptoContext';


function CustomTooltip({ payload, label, active, currency = "usd"}) {
    if (active && payload && payload.length >0) {
      return (
        <div className="custom-tooltip">
          <p className="label text-sm px-1 py-1 text-cyan">{`${label} : ${
            new Intl.NumberFormat("en-IN",{
                style: "currency",
                currency: currency,
                mininumFractionDigits:5,

            }).format(payload[0].value)
          }`}</p>
             </div>
      );
    }
  
    return null;
  }

const ChartComponent = ({data,currency,type}) => {

    return (
       
        <LineChart width={510} height={300} data={data}>
        <Line type="monotone" dataKey={type} stroke="#14ffce" strokeWidth={"1px"} />
        <CartesianGrid stroke="#323232"/>
        <XAxis dataKey ="date" hide/>
        <YAxis dataKey={type} hide domain={["auto","auto"]}/>
        <Tooltip content={<CustomTooltip />} currency={currency} cursor={false} wrapperStyle={{outline:"none"}}/>   
        <Legend/>
      </LineChart>
      
    );
};


const Chart = ({id}) => {

    const [chartData , setChartData] = useState();
    let {currency} = useContext(CryptoContext);
    const [type,setType] = useState("prices");
    const [days,setDays] = useState(7);

    useEffect(() => {

        const getChartData = async (id) => {
            try {

                const data = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily`).then(res => res.json()).then(json => json);
                console.log("chart-data",data);

                let convertedData = data[type].map((item) => {

                    return {
                        date:new Date(item[0]).toLocaleDateString(),
                        [type]: item[1],
                    };
                });

                setChartData(convertedData);
                
            }
            catch (error) {
                console.log(error);
            };
        };

        getChartData(id);

        },[id,type,days])
        

  return (
    <div className='w-full h-[60%]' >
<ChartComponent data={chartData} currency={currency} type ={type}/>
    <div className='flex '>
    <button className={`text-sm py-0.5 px-1.5 ml-2 bg-opacity-25 rounded capitalize ${type === "prices" ? 'bg-cyan text-cyan' : 'bg-gray-200 text-gray-100'}`}onClick={() => setType("prices")}>Price</button>
    <button className={`text-sm py-0.5 px-1.5 ml-2 bg-opacity-25 rounded capitalize ${type === "market_caps" ? 'bg-cyan text-cyan' : 'bg-gray-200 text-gray-100'}`}onClick={() => setType("market_caps")}>Market Cap</button>
    <button className={`text-sm py-0.5 px-1.5 ml-2 bg-opacity-25 rounded capitalize ${type === "total_volumes" ? 'bg-cyan text-cyan' : 'bg-gray-200 text-gray-100'}`}onClick={() => setType("total_volumes")}>Total Volumes</button>
    
    <button className={`text-sm py-0.5 px-1.5 ml-2 bg-opacity-25 rounded capitalize ${days === 7 ? 'bg-cyan text-cyan' : 'bg-gray-200 text-gray-100'}`}onClick={() => setDays(7)}>7d</button>
    <button className={`text-sm py-0.5 px-1.5 ml-2 bg-opacity-25 rounded capitalize ${days === 14 ? 'bg-cyan text-cyan' : 'bg-gray-200 text-gray-100'}`}onClick={() => setDays(14)}>14d</button>
    <button className={`text-sm py-0.5 px-1.5 ml-2 bg-opacity-25 rounded capitalize ${days=== 30 ? 'bg-cyan text-cyan' : 'bg-gray-200 text-gray-100'}`}onClick={() => setDays(30)}>30d</button>
    </div>
    </div>
  );
};

export default Chart;


