import { useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import axios from 'axios';

interface Result {
  result: string;
}

const ComparisonPage: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [resultReceipt, setResultReceipt] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    const { value, proof, address } = router.query;
    try {
      const response = await axios.get<Result>('/api/mint', {
        params: {
          value,
          proof,
          address,
        },
      });
      setResult(response.data.result);
      
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Compare Arrays</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="value">Array 1:</label>
          <input type="text" name="value" id="value" defaultValue={router.query.value} />
        </div>
        <div>
          <label htmlFor="proof">Array 2:</label>
          <input type="text" name="proof" id="proof" defaultValue={router.query.proof} />
        </div>
        <div>
          <label htmlFor="address">address:</label>
          <input type="text" name="address" id="address" defaultValue={router.query.address} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>
      {result !== null && <p>Transaction submitted. Check progress at <a href={"https://mumbai.polygonscan.com/tx/"+result}>https://mumbai.polygonscan.com/tx/{result}</a>.</p>}
      {result !== null && <p>Transaction submitted {result}.</p>}
    </div>
  );
};

export default ComparisonPage;
