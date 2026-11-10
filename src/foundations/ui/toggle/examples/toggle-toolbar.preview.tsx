import {
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextBIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "@phosphor-icons/react/dist/ssr";
import { ToggleGroup } from "#/foundations/ui/toggle/toggle.tsx";
import { Tooltip } from "#/foundations/ui/tooltip/tooltip.tsx";

export default function ToggleToolbarPreview() {
  return (
    <Tooltip.Group>
      <div className="flex items-center gap-2">
        <ToggleGroup type="multiple" aria-label="Text formatting">
          {[
            { value: "bold", label: "Bold", icon: <TextBIcon /> },
            { value: "italic", label: "Italic", icon: <TextItalicIcon /> },
            {
              value: "underline",
              label: "Underline",
              icon: <TextUnderlineIcon />,
            },
          ].map(({ value, label, icon }) => (
            <Tooltip key={value}>
              <Tooltip.Trigger asChild>
                <ToggleGroup.Item value={value} square aria-label={label}>
                  {icon}
                </ToggleGroup.Item>
              </Tooltip.Trigger>
              <Tooltip.Content>{label}</Tooltip.Content>
            </Tooltip>
          ))}
        </ToggleGroup>

        <ToggleGroup type="single" defaultValue="left" aria-label="Text alignment">
          {[
            { value: "left", label: "Align left", icon: <TextAlignLeftIcon /> },
            {
              value: "center",
              label: "Align center",
              icon: <TextAlignCenterIcon />,
            },
            {
              value: "right",
              label: "Align right",
              icon: <TextAlignRightIcon />,
            },
          ].map(({ value, label, icon }) => (
            <Tooltip key={value}>
              <Tooltip.Trigger asChild>
                <ToggleGroup.Item value={value} square aria-label={label}>
                  {icon}
                </ToggleGroup.Item>
              </Tooltip.Trigger>
              <Tooltip.Content>{label}</Tooltip.Content>
            </Tooltip>
          ))}
        </ToggleGroup>
      </div>
    </Tooltip.Group>
  );
}
