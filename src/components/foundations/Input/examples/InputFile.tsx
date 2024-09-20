import { Link } from 'components/foundations/Icons';
import { Input } from 'components/foundations/Input';

export function InputFile() {
  return <Input type="file" icon={<Link />} />;
}
