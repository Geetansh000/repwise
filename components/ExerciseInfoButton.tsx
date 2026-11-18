import { ExternalLink, Info, X } from 'lucide-react-native';
import { useState } from 'react';
import {
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { Exercise } from '../data/exercises';
import { exerciseImageReferences, licenseUrl } from '../data/exerciseImages';

export function ExerciseInfoButton({ exercise }: { exercise: Exercise }) {
  const [isOpen, setIsOpen] = useState(false);
  const image = exerciseImageReferences[exercise.id];

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Exercise information for ${exercise.name}`}
        onPress={() => setIsOpen(true)}
        style={styles.infoButton}
      >
        <Info size={17} color="#A3E635" />
      </Pressable>
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.titleCopy}>
                <Text style={styles.eyebrow}>EXERCISE INFO</Text>
                <Text style={styles.title}>{exercise.name}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close exercise information"
                onPress={() => setIsOpen(false)}
                style={styles.closeButton}
              >
                <X size={19} color="#F5F7F2" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {image ? (
                <>
                  <Image source={image.image} style={styles.image} resizeMode="contain" />
                  <Text style={styles.imageCaption}>
                    {image.sourceExerciseName === exercise.name
                      ? 'Exercise demonstration'
                      : `Closest available demonstration: ${image.sourceExerciseName}`}
                  </Text>
                  <Text style={styles.attribution}>
                    Free Exercise DB · Public domain (Unlicense)
                  </Text>
                  <View style={styles.sourceLinks}>
                    <Pressable
                      accessibilityRole="link"
                      onPress={() => {
                        void Linking.openURL(image.sourceUrl).catch((error: unknown) => {
                          console.error('Unable to open the exercise image source.', error);
                        });
                      }}
                      style={styles.sourceLink}
                    >
                      <Text style={styles.sourceLinkText}>Image source</Text>
                      <ExternalLink size={13} color="#A3E635" />
                    </Pressable>
                    <Pressable
                      accessibilityRole="link"
                      onPress={() => {
                        void Linking.openURL(licenseUrl).catch((error: unknown) => {
                          console.error('Unable to open the exercise image license.', error);
                        });
                      }}
                      style={styles.sourceLink}
                    >
                      <Text style={styles.sourceLinkText}>Unlicense</Text>
                      <ExternalLink size={13} color="#A3E635" />
                    </Pressable>
                  </View>
                </>
              ) : (
                <Text style={styles.errorText}>
                  No bundled reference image is available for this custom exercise.
                </Text>
              )}

              <Text style={styles.sectionLabel}>How to perform</Text>
              <Text style={styles.instructions}>{exercise.instructions}</Text>
              <Text style={styles.disclaimer}>
                Images are bundled from Free Exercise DB under the Unlicense. Some variations use the closest available demonstration, so follow the instructions for this exercise.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  infoButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#172334',
    borderWidth: 1,
    borderColor: '#35465B',
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    padding: 18,
  },
  modalCard: {
    width: '100%',
    maxWidth: 560,
    maxHeight: '90%',
    alignSelf: 'center',
    backgroundColor: '#111A27',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#35465B',
    padding: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  titleCopy: {
    flex: 1,
  },
  eyebrow: {
    color: '#A3E635',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    color: '#F5F7F2',
    fontSize: 19,
    fontWeight: '800',
    marginTop: 3,
  },
  closeButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#253244',
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    backgroundColor: '#080D16',
  },
  imageCaption: {
    color: '#D5DBE5',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 8,
  },
  attribution: {
    color: '#929B91',
    fontSize: 10,
    marginTop: 5,
  },
  sourceLinks: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  sourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sourceLinkText: {
    color: '#A3E635',
    fontSize: 11,
    fontWeight: '700',
  },
  errorText: {
    color: '#F6A66A',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
  },
  sectionLabel: {
    color: '#F5F7F2',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
  },
  instructions: {
    color: '#D5DBE5',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
  disclaimer: {
    color: '#8290A2',
    fontSize: 9,
    lineHeight: 13,
    marginTop: 12,
  },
});
