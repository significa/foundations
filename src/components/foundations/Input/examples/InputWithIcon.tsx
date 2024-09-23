import { Link } from 'components/foundations/Icons';
import { Input } from 'components/foundations/Input';

export function InputWithIcon() {
  return <Input type="url" placeholder="https://significa.co" label="URL" icon={<Link />} />;
}
