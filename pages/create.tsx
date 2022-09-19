import { Default } from 'components/layouts/Default';
import { Create } from 'components/templates/create';
import type { NextPage } from 'next';

const CreatePage: NextPage = () => {
  return (
    <Default pageName="Create">
      <Create />
    </Default>
  );
};

export default CreatePage;
