import { Link } from '@/foundations/components/Icons';
import { Input } from '@/foundations/components/Input';

export function InputWithIcon() {
  return <Input type="url" placeholder="https://significa.co" label="URL" icon={<Link />} />;
}
