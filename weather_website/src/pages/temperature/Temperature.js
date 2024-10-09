import { useState, useEffect} from 'react';
import getTestData from "../../services/test-data";


function Temperature() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const result = await getTestData();
      setData(result);
    };
    fetchData();
  }, []);

  return (
    <div>
      Temperature X is {data?.x.toString()} and Y is {data?.y.toString()}
    </div>
  );
}

export default Temperature;
