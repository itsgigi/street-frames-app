import { Text } from 'react-native';
import { fonts, sf } from "@/constants/theme"

type SectionHeaderProps = {
    children: string
}

export function SectionHeader ({children}: SectionHeaderProps) {
    return (
        <Text style={{ fontSize: 13, fontWeight: '700', color: sf.black, letterSpacing: 0.5, marginBottom: 10, opacity: 0.6, fontFamily: fonts.heading }}>
            {children}
        </Text>
    )
}